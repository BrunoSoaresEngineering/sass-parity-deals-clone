import { env } from '@/data/env/server';
import { getTierByPriceId, subscriptionTiers } from '@/data/subscription-tiers';
import { UserSubscriptionTable } from '@/db/schema';
import { updateUserSubscription } from '@/repositories/subscription';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function handleCreate(subscription: Stripe.Subscription) {
  const { clerkUserId } = subscription.metadata;
  const tier = getTierByPriceId(subscription.items.data[0].price.id);

  if (!clerkUserId || !tier) {
    throw new Error();
  }

  const { customer } = subscription;
  const customerId = typeof customer === 'string' ? customer : customer.id;

  return updateUserSubscription(
    {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
      tier: tier.name,
    },
    eq(UserSubscriptionTable.clerkUserId, clerkUserId),
    clerkUserId,
  );
}

async function handleUpdate(subscription: Stripe.Subscription) {
  const { clerkUserId } = subscription.metadata;
  const tier = getTierByPriceId(subscription.items.data[0].price.id);

  if (!clerkUserId || !tier) {
    throw new Error();
  }

  const { customer } = subscription;
  const customerId = typeof customer === 'string' ? customer : customer.id;

  return updateUserSubscription(
    { tier: tier.name },
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    clerkUserId,
  );
}

async function handleDelete(subscription: Stripe.Subscription) {
  const { clerkUserId } = subscription.metadata;

  if (!clerkUserId) {
    throw new Error();
  }

  const { customer } = subscription;
  const customerId = typeof customer === 'string' ? customer : customer.id;

  return updateUserSubscription(
    {
      tier: subscriptionTiers.Free.name,
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
      stripeCustomerId: null,
    },
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    clerkUserId,
  );
}

export async function POST(request: NextRequest) {
  const stripeHeaderProp = request.headers.get('stripe-signature');
  if (!stripeHeaderProp) {
    return new Response(null, { status: 500 });
  }

  const event = stripe.webhooks.constructEvent(
    await request.text(),
    stripeHeaderProp,
    env.STRIPE_WEBHOOK_SECRET,
  );

  try {
    // eslint-disable-next-line default-case
    switch (event.type) {
      case 'customer.subscription.deleted': {
        handleDelete(event.data.object);
        break;
      }
      case 'customer.subscription.updated': {
        handleUpdate(event.data.object);
        break;
      }
      case 'customer.subscription.created': {
        handleCreate(event.data.object);
        break;
      }
    }
  } catch {
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
