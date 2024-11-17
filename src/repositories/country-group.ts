import {
  and,
  eq,
  inArray,
  sql,
} from 'drizzle-orm';
import { db } from '@/db';
import { CountryGroupDiscountTable, CountryGroupTable } from '@/db/schema';
import {
  CACHE_TAGS,
  clearFullCache,
  dbCache,
  getGlobalTag,
  getIdTag,
  revalidateDbCache,
} from '@/lib/cache';
import { BatchItem } from 'drizzle-orm/batch';
import { getProduct } from './product';

export async function addCountryGroups(data: typeof CountryGroupTable.$inferInsert[]) {
  const { rowCount } = await db
    .insert(CountryGroupTable)
    .values(data)
    .onConflictDoUpdate({
      target: CountryGroupTable.name,
      set: {
        recommendedDiscountPercentage: sql.raw(
          `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`,
        ),
      },
    });

  const isUpdated = rowCount > 0;

  if (isUpdated) {
    clearFullCache();
  }

  return rowCount;
}

export async function getAll(options: Parameters<typeof db.query.CountryGroupTable.findMany>[0]) {
  return db.query.CountryGroupTable.findMany(options);
}

async function getCountryGroupDiscountsByProductInternal({
  userId,
  productId,
}: {
  userId: string,
  productId: string
}) {
  const product = await getProduct({ id: productId, userId });
  if (!product) {
    return [];
  }

  const countryGroupData = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        where: ({ productId: id }) => eq(id, productId),
      },
    },
    columns: {
      id: true,
      name: true,
      recommendedDiscountPercentage: true,
    },
  });

  return countryGroupData.map((groupData) => ({
    id: groupData.id,
    name: groupData.name,
    recommendedDiscountPercentage: groupData.recommendedDiscountPercentage,
    countries: groupData.countries,
    discount: groupData.countryGroupDiscounts.at(0),
  }));
}

export async function getCountryGroupDiscountsByProduct({
  userId,
  productId,
}: {
  userId: string,
  productId: string
}) {
  const getCountryGroupDiscountsByProductCached = dbCache(
    getCountryGroupDiscountsByProductInternal,
    {
      tags: [
        getGlobalTag(CACHE_TAGS.countries),
        getGlobalTag(CACHE_TAGS.countryGroups),
        getIdTag(productId, CACHE_TAGS.products),
      ],
    },
  );

  return getCountryGroupDiscountsByProductCached({ productId, userId });
}

export async function updateCountryDiscounts(
  deleteGroups: { countryGroupId: string }[],
  insertGroups: (typeof CountryGroupDiscountTable.$inferInsert)[],
  { productId, userId }: { productId: string, userId: string },
) {
  const statements: BatchItem<'pg'>[] = [];

  const deleteCountryGroupIds = deleteGroups.map((deleteGroup) => deleteGroup.countryGroupId);

  if (deleteGroups.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(CountryGroupDiscountTable.countryGroupId, deleteCountryGroupIds),
        ),
      ),
    );
  }

  if (insertGroups.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroups)
        .onConflictDoUpdate({
          target: [
            CountryGroupDiscountTable.countryGroupId,
            CountryGroupDiscountTable.productId,
          ],
          set: {
            coupon: sql.raw(`excluded.${CountryGroupDiscountTable.coupon.name}`),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`,
            ),
          },
        }),
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<'pg'>]);
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    id: productId,
    userId,
  });
}
