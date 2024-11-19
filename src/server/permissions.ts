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
