import { db } from '@/db';
import { ProductTable, ProductViewTable } from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';
import { formatDate, formatMonth } from '@/lib/fomatters';
import {
  and,
  count,
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
  },
  last30Days: {
    label: 'Last 30 days',
    sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) => sql<string>`DATE(${col})`.inlineParams(),
    dateFormatter: formatDate,
  },
  last365Days: {
    label: 'Last 365 days',
    sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) => sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
    dateFormatter: formatMonth,
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
      productId ? getIdTag(productId, CACHE_TAGS.products) : getIdTag(userId, CACHE_TAGS.products),
    ],
  });

  return getViewsByDayCached({
    userId,
    productId,
    timezone,
    interval,
  });
}
