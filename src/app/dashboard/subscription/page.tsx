/* eslint-disable react/jsx-props-no-spreading */
import { startOfMonth } from 'date-fns';
import { createCustomerPortalSession } from '@/server/actions/stripe';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { subscriptionTiers, subscriptionTiersInOrder } from '@/data/subscription-tiers';
import { formatCompactNumber } from '@/lib/fomatters';
import { getProductCount } from '@/repositories/product';
import { getTierByUserId } from '@/repositories/subscription';
import { auth } from '@clerk/nextjs/server';
import { getProductViewCount } from '@/repositories/product-views';
import PricingCard from '../_components/Pricing-card';

async function SubscriptionPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
    return null;
  }

  const tier = await getTierByUserId(userId);

  const pageVisits = await getProductViewCount(userId, startOfMonth(new Date()));
  const productNumber = await getProductCount(userId);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6">Your Subscription</h1>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                {`${formatCompactNumber(pageVisits)} / ${formatCompactNumber(tier.maxNumberOfVisits)} `}
                pricing page visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(pageVisits / tier.maxNumberOfVisits) * 100}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Number of Products</CardTitle>
              <CardDescription>
                {`${productNumber} / ${tier.maxNumberOfProducts} products created`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(productNumber / tier.maxNumberOfProducts) * 100}
              />
            </CardContent>
          </Card>
        </div>

        {tier !== subscriptionTiers.Free && (
          <Card>
            <CardHeader>
              <CardTitle>{`You are currently on the ${tier.name} plan!`}</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCustomerPortalSession}>
                <Button
                  variant="accent"
                  size="lg"
                  className="text-lg rounded-lg"
                >
                  Manage Subscription
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {subscriptionTiersInOrder.map((subscriptionTier) => (
          <PricingCard
            key={subscriptionTier.name}
            currentTierName={tier.name}
            {...subscriptionTier}
          />
        ))}
      </div>
    </>
  );
}
export default SubscriptionPage;
