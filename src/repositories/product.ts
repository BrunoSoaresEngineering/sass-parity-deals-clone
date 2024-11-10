import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { ProductCustomizationTable, ProductTable } from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';

async function getProductsInternal(
  userId: string,
  { limit }: { limit?: number} = {},
) {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
}

export function getProducts(
  userId: string,
  options?: Parameters<typeof getProductsInternal>[1],
) {
  const getProductsCached = dbCache(getProductsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return getProductsCached(userId, options);
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
  const [newProduct] = await db
    .insert(ProductTable)
    .values(data)
    .returning({
      id: ProductTable.id,
      userId: ProductTable.clerkUserId,
    });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch {
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: data.clerkUserId,
    id: newProduct.id,
  });

  return newProduct;
}

export async function deleteProduct({ productId, userId } : { productId: string, userId: string }) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, productId), eq(ProductTable.clerkUserId, userId)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id: productId,
    });
  }

  return rowCount > 0;
}
