'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { productCountryDiscountsSchema, productCustomizationSchema, productDetailsSchema } from '@/schemas/products';
import { auth } from '@clerk/nextjs/server';
import {
  updateProductCustomization as updateProductCustomizationDB,
} from '@/repositories/customization';
import {
  createProduct as createProductDB,
  deleteProduct as deleteProductDB,
  updateProduct as updateProductDB,
} from '@/repositories/product';
import { updateCountryDiscounts as updateCountryDiscountsDB } from '@/repositories/country-group';
import { checkCustomizeBanner } from '../permissions';

// eslint-disable-next-line consistent-return
export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>,
): Promise<{ error: boolean, message: string} | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!userId || !success) {
    return {
      error: true,
      message: 'There was an error creating your product. Please try again.',
    };
  }

  const { id } = await createProductDB({ clerkUserId: userId, ...data });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>,
): Promise<{ error: boolean, message: string }> {
  const errorMessage = 'There was an error updating your product. Please try again.';

  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || !userId) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await updateProductDB(data, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? 'Product details updates' : errorMessage,
  };
}

export async function deleteProduct(id: string) {
  const { userId } = await auth();

  const errorMessage = 'There was an error deleting your product';

  if (!userId) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDB({ productId: id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? 'Product deleted successfully' : errorMessage,
  };
}

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>,
) {
  const { data } = productCountryDiscountsSchema.safeParse(unsafeData);
  const { userId } = await auth();

  if (!data || !userId) {
    return { error: true, message: 'There was an error saving your country discounts' };
  }

  const deleteGroups: { countryGroupId: string }[] = [];
  const insertGroups: {
    countryGroupId: string,
    productId: string,
    coupon: string,
    discountPercentage: number,
  }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null && group.coupon.length > 0
      && group.discountPercentage != null && group.discountPercentage > 0
    ) {
      insertGroups.push({
        countryGroupId: group.countryGroupId,
        productId: id,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
      });
    } else {
      deleteGroups.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDB(deleteGroups, insertGroups, { productId: id, userId });

  return { error: false, message: 'Country Discounts Saved' };
}

export async function updateProductCustomization(
  id: string,
  unsafeData: z.infer<typeof productCustomizationSchema>,
) {
  const { userId } = await auth();
  const { success, data } = productCustomizationSchema.safeParse(unsafeData);
  const canCustomize = checkCustomizeBanner(userId);

  if (!success || !userId || !canCustomize) {
    return {
      error: true,
      message: 'There was an error updating your banner',
    };
  }

  await updateProductCustomizationDB({ productId: id, userId }, data);

  return { error: false, message: 'Banner updated' };
}
