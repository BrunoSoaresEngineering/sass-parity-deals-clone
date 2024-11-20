import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/fomatters';
import { SignInButton } from '@clerk/nextjs';
import Feature from '@/components/Feature';

type PricingCardProps = {
  name: string,
  priceInCents: number,
  maxNumberOfVisits: number,
  maxNumberOfProducts: number,
  canAccessAnalytics: boolean,
  canCustomizeBanner: boolean,
  canRemoveBranding: boolean,
  isMostPopular?: boolean,
}
function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
  isMostPopular = false,

}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative shadow-none rounded-3xl overflow-hidden',
        isMostPopular ? 'border-accent border-2' : 'border-none',
      )}
    >
      {isMostPopular && (
        <div
          className={cn(
            'absolute -right-8 top-24 py-1 px-10 bg-accent text-accent-foreground',
            'origin-top-right rotate-45',
          )}
        >
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-accent font-semibold mb-8">
          {name}
        </CardTitle>
        <CardDescription className="flex flex-col items-start gap-2">
          <span className="text-xl font-bold text-primary">
            $
            {formatCompactNumber(priceInCents / 100)}
            {' '}
            /mo
          </span>
          <span>
            {formatCompactNumber(maxNumberOfVisits)}
            {' '}
            pricing page visits/mo
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInButton>
          <Button
            className="w-full text-lg rounded-lg"
            variant={isMostPopular ? 'accent' : 'default'}
          >
            Get Started
          </Button>
        </SignInButton>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}
          {' '}
          {maxNumberOfProducts === 1 ? 'product' : 'products'}
        </Feature>
        <Feature>PPP Discounts</Feature>
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
        {canCustomizeBanner && <Feature>Banner Customization</Feature>}
      </CardFooter>
    </Card>
  );
}
export default PricingCard;
