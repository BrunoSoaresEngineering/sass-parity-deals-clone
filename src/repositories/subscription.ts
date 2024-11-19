import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { UserSubscriptionTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';
import { subscriptionTiers } from '@/data/subscription-tiers';
import { getProducts } from './product';

export async function createUserSubscription(data: typeof UserSubscriptionTable.$inferInsert) {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  revalidateDbCache({
    tag: CACHE_TAGS.subscription,
    userId: newSubscription.userId,
    id: newSubscription.id,
  });

  return newSubscription;
}

export async function deleteUserSubscription(clerkUserId: string) {
  const userProducts = await getProducts(clerkUserId);

  const [userSubscriptions] = await db
    .delete(UserSubscriptionTable)
    .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
    .returning({
      id: UserSubscriptionTable.id,
    });

  revalidateDbCache({
    tag: CACHE_TAGS.subscription,
    userId: clerkUserId,
    id: userSubscriptions.id,
  });

  userProducts.forEach((userProduct) => revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: clerkUserId,
    id: userProduct.id,
  }));

  return userSubscriptions;
}

export async function getTierByUserId(userId: string) {
  const subscription = await db.query.UserSubscriptionTable.findFirst({
    where: ({ clerkUserId }) => eq(clerkUserId, userId),
  });

  if (!subscription) {
    throw new Error('User has no subscription');
  }

  return subscriptionTiers[subscription.tier];
}
