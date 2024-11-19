import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { ProductCustomizationTable } from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getIdTag,
  revalidateDbCache,
} from '@/lib/cache';
import { getProduct } from './product';

async function getByProductIdInternal({
  productId,
  userId,
}: {
  productId: string,
  userId: string,
}) {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id, clerkUserId }, { and }) => and(
      eq(id, productId),
      eq(clerkUserId, userId),
    ),
    with: {
      productCustomization: true,
    },
  });

  return data?.productCustomization;
}

export function getByProductId({
  productId,
  userId,
}: {
  productId: string,
  userId: string,
}) {
  const getByProductIdCached = dbCache(getByProductIdInternal, {
    tags: [getIdTag(productId, CACHE_TAGS.products)],
  });

  return getByProductIdCached({ productId, userId });
}

export async function updateProductCustomization(
  { productId, userId }: {productId: string, userId: string },
  data: Partial<typeof ProductCustomizationTable.$inferInsert>,
) {
  const product = await getProduct({ id: productId, userId });
  if (!product) {
    return;
  }

  await db
    .update(ProductCustomizationTable)
    .set(data)
    .where(eq(ProductCustomizationTable.productId, productId));

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    id: productId,
    userId,
  });
}

const exports = {
  getByProductId,
  updateProductCustomization,
};

export default exports;
