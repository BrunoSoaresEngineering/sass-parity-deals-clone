import { getProductCount } from '@/repositories/product';
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
