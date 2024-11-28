'use server';

import { Stripe } from 'stripe';
import { subscriptionTiers, type PaidTierNames } from '@/data/subscription-tiers';
import { getSubscriptionByUserId } from '@/repositories/subscription';
import { auth, currentUser, User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { env as serverEnv } from '@/data/env/server';
import { env as clientEnv } from '@/data/env/client';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });

  return session.url;
}

async function getCustomerPortalSession(stripeCustomerId: string) {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });

  return portalSession.url;
}

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null,
    stripeSubscriptionId: string | null,
    stripeSubscriptionItemId: string | null,
  },
) {
  if (
    !subscription.stripeCustomerId
    || !subscription.stripeSubscriptionId
    || !subscription.stripeSubscriptionItemId
  ) {
    throw new Error('Internal Error. Not possible to update subscription. Please try again.');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: 'subscription_update_confirm',
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const subscription = await getSubscriptionByUserId(user.id);
  if (!subscription) {
    return;
  }

  if (!subscription.stripeCustomerId) {
    const url = await getCheckoutSession(tier, user);
    if (!url) {
      return;
    }
    redirect(url);
  }

  const url = await getSubscriptionUpgradeSession(tier, subscription);
  if (!url) {
    return;
  }
  redirect(url);
}

export async function createCancelSession() {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const subscription = await getSubscriptionByUserId(user.id);
  if (!subscription) {
    return;
  }

  if (!subscription.stripeCustomerId || !subscription.stripeSubscriptionId) {
    return;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: 'subscription_cancel',
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  });

  redirect(portalSession.url);
}

export async function createCustomerPortalSession() {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const subscription = await getSubscriptionByUserId(userId);

  if (!subscription?.stripeCustomerId) {
    return;
  }

  const url = await getCustomerPortalSession(subscription.stripeCustomerId);

  redirect(url);
}
