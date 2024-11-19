import { getTierByUserId } from '@/repositories/subscription';

export async function checkRemoveBranding(userID: string) {
  const tier = await getTierByUserId(userID);
  return tier.canRemoveBranding;
}

export async function checkCustomizeBanner(userID: string) {
  const tier = await getTierByUserId(userID);
  return tier.canCustomizeBanner;
}
