import { db } from '@/db';
import { CACHE_TAGS, dbCache, getIdTag } from '@/lib/cache';

async function getByProductIdInternal({
  productId,
  userId,
}: {
  productId: string,
  userId: string,
}) {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) => and(
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

const exports = {
  getByProductId,
};

export default exports;
