import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { subscriptionTiersInOrder } from '@/data/subscription-tiers';
import { formatCompactNumber } from '@/lib/fomatters';
import { getProductCount } from '@/repositories/product';
import { getTierByUserId } from '@/repositories/subscription';
import { auth } from '@clerk/nextjs/server';
import PricingCard from '../_components/Pricing-card';

async function SubscriptionPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
    return null;
  }

  const tier = await getTierByUserId(userId);

  const pageVisits = 0;
  const productNumber = await getProductCount(userId);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6">Your Subscription</h1>

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {subscriptionTiersInOrder.map((subscriptionTier) => (
          <PricingCard
            key={subscriptionTier.name}
            name={subscriptionTier.name}
            priceInCents={subscriptionTier.priceInCents}
            maxNumberOfVisits={subscriptionTier.maxNumberOfVisits}
            maxNumberOfProducts={subscriptionTier.maxNumberOfProducts}
            canRemoveBranding={subscriptionTier.canRemoveBranding}
            canAccessAnalytics={subscriptionTier.canAccessAnalytics}
            canCustomizeBanner={subscriptionTier.canCustomizeBanner}
            stripePriceId={subscriptionTier.stripePriceId}
            currentTierName={tier.name}
          />
        ))}
      </div>
    </>
  );
}
export default SubscriptionPage;
