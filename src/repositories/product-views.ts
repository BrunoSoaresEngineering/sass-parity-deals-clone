import { db } from '@/db';
import { ProductTable, ProductViewTable } from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';
import {
  and,
  count,
  eq,
  gte,
} from 'drizzle-orm';

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
