import Feature from '@/components/Feature';
import { Button } from '@/components/ui/button';
import { formatCompactNumber } from '@/lib/fomatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createCancelSession, createCheckoutSession } from '@/server/actions/stripe';
import { type TierNames, subscriptionTiersInOrder } from '@/data/subscription-tiers';

type PricingCardProps = (typeof subscriptionTiersInOrder[number] & { currentTierName: TierNames })

function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  currentTierName,
}: PricingCardProps) {
  const isCurrent = name === currentTierName;

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <h2 className="text-accent font-semibold mb-8">{name}</h2>
        <CardTitle className="text-xl font-bold">{`$${priceInCents / 100} /mo`}</CardTitle>
        <CardDescription>
          {`${formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={name === 'Free' ? createCancelSession : createCheckoutSession.bind(null, name)}
        >
          <Button
            className="w-full text-lg rounded-lg"
            disabled={isCurrent}
          >
            {isCurrent ? 'Current' : 'Swap'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-semibold">
          {`${maxNumberOfProducts} ${maxNumberOfProducts === 1 ? 'product' : 'products'}`}
        </Feature>
        <Feature>PPP discounts</Feature>
        {canRemoveBranding && (<Feature>Remove Easy PPP branding</Feature>)}
        {canAccessAnalytics && (<Feature>Advanced Analytics</Feature>)}
        {canCustomizeBanner && (<Feature>Banner Customization</Feature>)}
      </CardFooter>
    </Card>
  );
}

export default PricingCard;
