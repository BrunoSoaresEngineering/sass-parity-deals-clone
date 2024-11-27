import { db } from '@/db';
import { ProductTable, ProductViewTable } from '@/db/schema';
import {
  and,
  count,
  eq,
  gte,
} from 'drizzle-orm';

export async function createProductView(
  productId: string,
  countryId: string,
) {
  await db
    .insert(ProductViewTable)
    .values({
      productId,
      countryId,
      visitedAt: new Date(),
    });
}

export async function getProductViewCount(userId: string, startDate: Date) {
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
