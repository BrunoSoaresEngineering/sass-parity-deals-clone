import { db } from '@/db';
import { UserSubscriptionTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

  return newSubscription;
}

export async function deleteUserSubscription(clerkUserId: string) {
  const userSubscriptions = await db
    .delete(UserSubscriptionTable)
    .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
    .returning({
      id: UserSubscriptionTable.id,
    });

  return userSubscriptions;
}
