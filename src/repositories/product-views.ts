import { db } from '@/db';
import { ProductViewTable } from '@/db/schema';

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
