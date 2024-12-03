import { db } from '@/db';
import {
  CountryGroupTable,
  CountryTable,
  ProductTable,
  ProductViewTable,
} from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';
import { formatDate, formatMonth } from '@/lib/fomatters';
import { startOfDay, subDays } from 'date-fns';
import { tz } from '@date-fns/tz';
import {
  and,
  count,
  desc,
  eq,
  gte,
  SQL,
  sql,
} from 'drizzle-orm';

export const CHART_INTERVALS = {
  last7Days: {
    label: 'Last 7 days',
    sql: sql`GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) => sql<string>`DATE(${col})`.inlineParams(),
    dateFormatter: formatDate,
    startDate: subDays(new Date(), 7),
  },
  last30Days: {
    label: 'Last 30 days',
    sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) => sql<string>`DATE(${col})`.inlineParams(),
    dateFormatter: formatDate,
    startDate: subDays(new Date(), 30),
  },
  last365Days: {
    label: 'Last 365 days',
    sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) => sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
    dateFormatter: formatMonth,
    startDate: subDays(new Date(), 365),
  },
};

export async function createProductView(
  productId: string,
  countryId: string,
  userId: string,
) {
  const [newRow] = await db
    .insert(ProductViewTable)
    .values({
      productId,
      countryId,
      visitedAt: new Date(),
    })
    .returning({ id: ProductViewTable.id });

  revalidateDbCache({
    tag: CACHE_TAGS.productViews,
    userId,
    id: newRow.id,
  });
}

async function getProductViewCountInternal(userId: string, startDate: Date) {
  const viewsCount = await db
    .select({ productViews: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductViewTable.productId, ProductTable.id))
    .where(
      and(
        eq(ProductTable.clerkUserId, userId),
        gte(ProductViewTable.visitedAt, startDate),
      ),
    );

  return viewsCount[0].productViews ?? 0;
}

export async function getProductViewCount(userId: string, startDate: Date) {
  const getProductViewCountCached = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return getProductViewCountCached(userId, startDate);
}

function getProductSubQuery(
  userId: string,
  productId?: string,
) {
  return db.$with('products').as(
    db
      .select()
      .from(ProductTable)
      .where(
        and(
          eq(ProductTable.clerkUserId, userId),
          productId ? eq(ProductTable.id, productId) : undefined,
        ),
      ),
  );
}

async function getViewsByDayInternal({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS]
}) {
  const productsSubQuery = getProductSubQuery(userId, productId);

  const productViewSubQuery = db.$with('productViews').as(
    db
      .with(productsSubQuery)
      .select({
        productId: ProductViewTable.productId,
        visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as('visitedAt'),
      })
      .from(ProductViewTable)
      .innerJoin(productsSubQuery, eq(productsSubQuery.id, ProductViewTable.productId)),
  );

  return db
    .with(productViewSubQuery)
    .select({
      date: interval
        .dateGrouper(sql.raw('series'))
        .mapWith((dateString) => interval.dateFormatter(new Date(dateString))),
      views: count(productViewSubQuery.visitedAt),
    })
    .from(interval.sql)
    .leftJoin(
      productViewSubQuery,
      ({ date }) => eq(date, interval.dateGrouper(productViewSubQuery.visitedAt)),
    )
    .groupBy(({ date }) => [date])
    .orderBy(({ date }) => date);
}

export async function getViewsByDay({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS]
}) {
  const getViewsByDayCached = dbCache(getViewsByDayInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId
        ? getIdTag(productId, CACHE_TAGS.products)
        : getUserTag(userId, CACHE_TAGS.products),
    ],
  });

  return getViewsByDayCached({
    userId,
    productId,
    timezone,
    interval,
  });
}

async function getViewsByPPPGroupInternal({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS],
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });

  const productsSubQuery = getProductSubQuery(userId, productId);

  const productViewsSubquery = db.$with('productViews').as(
    db
      .with(productsSubQuery)
      .select({
        visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as('visitedAt'),
        countryGroupId: CountryTable.countryGroupId,
      })
      .from(ProductViewTable)
      .innerJoin(productsSubQuery, eq(productsSubQuery.id, ProductViewTable.productId))
      .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
      .where(({ visitedAt }) => gte(visitedAt, startDate)),
  );

  return db
    .with(productViewsSubquery)
    .select({
      pppName: CountryGroupTable.name,
      views: count(productViewsSubquery.visitedAt),
    })
    .from(CountryGroupTable)
    .leftJoin(productViewsSubquery, eq(productViewsSubquery.countryGroupId, CountryGroupTable.id))
    .groupBy(({ pppName }) => [pppName])
    .orderBy(({ pppName }) => pppName);
}

export async function getViewsByPPPGroup({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS],
}) {
  const getViewsByPPPGroupCached = dbCache(getViewsByPPPGroupInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
      getIdTag(userId, CACHE_TAGS.productViews),
      productId
        ? getIdTag(productId, CACHE_TAGS.products)
        : getUserTag(userId, CACHE_TAGS.products),
    ],
  });

  return getViewsByPPPGroupCached({
    userId,
    productId,
    timezone,
    interval,
  });
}

async function getViewsByCountryInternal({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: typeof CHART_INTERVALS[keyof typeof CHART_INTERVALS]
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });

  const productSubQuery = getProductSubQuery(userId, productId);

  return db
    .with(productSubQuery)
    .select({
      countryCode: CountryTable.code,
      countryName: CountryTable.name,
      views: count(ProductViewTable.visitedAt),
    })
    .from(ProductViewTable)
    .innerJoin(productSubQuery, eq(productSubQuery.id, ProductViewTable.productId))
    .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
    .where(
      gte(sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`.inlineParams(), startDate),
    )
    .groupBy(({ countryCode, countryName }) => [countryCode, countryName])
    .orderBy(({ views }) => desc(views))
    .limit(25);
}

export async function getViewsByCountry({
  userId,
  productId,
  timezone,
  interval,
}: {
  userId: string,
  productId?: string,
  timezone: string,
  interval: typeof CHART_INTERVALS[keyof typeof CHART_INTERVALS]
}) {
  const getViewsByCountryCached = dbCache(getViewsByCountryInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.countries),
      getUserTag(userId, CACHE_TAGS.productViews),
      productId
        ? getIdTag(productId, CACHE_TAGS.products)
        : getUserTag(userId, CACHE_TAGS.products),
    ],
  });

  return getViewsByCountryCached({
    userId,
    productId,
    timezone,
    interval,
  });
}
