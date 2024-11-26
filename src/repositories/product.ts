import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { ProductCustomizationTable, ProductTable } from '@/db/schema';
import {
  CACHE_TAGS,
  dbCache,
  getIdTag,
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

async function getProductInternal({ id, userId }: { id: string, userId: string }) {
  return db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id: productId }) => and(
      eq(productId, id),
      eq(clerkUserId, userId),
    ),
  });
}

export function getProduct({ id, userId }: { id: string, userId: string }) {
  const getProductCached = dbCache(getProductInternal, {
    tags: [getIdTag(id, CACHE_TAGS.products)],
  });

  return getProductCached({ id, userId });
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

export async function updateProduct(
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: { id: string, userId: string },
): Promise<boolean> {
  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  const isUpdated = rowCount > 0;

  if (isUpdated) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return isUpdated;
}

export async function deleteProduct({ productId, userId } : { productId: string, userId: string }) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, productId), eq(ProductTable.clerkUserId, userId)));

  const isUpdated = rowCount > 0;

  if (isUpdated) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id: productId,
    });
  }

  return isUpdated;
}

async function getProductCountInternal(userId: string) {
  const counts = await db
    .select({ productCount: count() })
    .from(ProductTable)
    .where(eq(ProductTable.clerkUserId, userId));

  return counts[0]?.productCount ?? 0;
}

export async function getProductCount(userId:string) {
  const getProductCountCached = dbCache(
    getProductCountInternal,
    { tags: [getUserTag(userId, CACHE_TAGS.products)] },
  );

  return getProductCountCached(userId);
}

export async function getProductForBanner({
  id,
  countryCode,
}: {
  id: string,
  countryCode: string,
}) {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id: productId }) => eq(productId, id),
    columns: {
      id: true,
      clerkUserId: true,
    },
    with: {
      productCustomization: true,
      CountryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        with: {
          countryGroup: {
            columns: {},
            with: {
              countries: {
                columns: {
                  id: true,
                  name: true,
                },
                limit: 1,
                where: ({ code }) => eq(code, countryCode),
              },
            },
          },
        },
      },
    },
  });

  const targetGroupDiscount = data?.CountryGroupDiscounts.find((group) => (
    group.countryGroup.countries.length > 0
  ));

  const discount = !data?.productCustomization || !targetGroupDiscount ? undefined : {
    coupon: targetGroupDiscount.coupon,
    percentage: targetGroupDiscount.discountPercentage,
  };

  return {
    customization: data?.productCustomization,
    country: targetGroupDiscount?.countryGroup.countries.at(0),
    discount,
  };
}
