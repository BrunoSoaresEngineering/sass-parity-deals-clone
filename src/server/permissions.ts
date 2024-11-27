import { startOfMonth } from 'date-fns';
import { getProductCount } from '@/repositories/product';
import { getProductViewCount } from '@/repositories/product-views';
import { getTierByUserId } from '@/repositories/subscription';

export async function checkRemoveBranding(userId: string | null | undefined) {
  if (!userId) {
    return false;
  }

  const tier = await getTierByUserId(userId);
  return tier.canRemoveBranding;
}

export async function checkCustomizeBanner(userId: string | null | undefined) {
  if (!userId) {
    return false;
  }
  const tier = await getTierByUserId(userId);
  return tier.canCustomizeBanner;
}

export async function checkCreateProduct(userId: string | null | undefined) {
  if (!userId) {
    return false;
  }

  const tierPromise = getTierByUserId(userId);
  const numProductsPromise = getProductCount(userId);
  const [tier, numProducts] = await Promise.all([tierPromise, numProductsPromise]);

  return tier.maxNumberOfProducts > numProducts;
}

export async function canShowDiscountBanner(userId: string | null | undefined) {
  if (!userId) {
    return false;
  }

  const tier = await getTierByUserId(userId);
  const productViewCount = await getProductViewCount(userId, startOfMonth(new Date()));

  return tier.maxNumberOfVisits > productViewCount;
}
