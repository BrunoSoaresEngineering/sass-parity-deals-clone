import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { subscriptionTiersInOrder } from '@/data/subscription-tiers';
import { cn } from '@/lib/utils';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Neon from './_icons/Neon';
import ClerkIcon from './_icons/Clerk';
import PricingCard from './_components/Pricing-card';

function page() {
  return (
    <>
      <section
        className={cn(
          'min-h-screen flex flex-col items-center justify-center gap-8 px-4',
          'text-center text-balance',
          'bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)]',
        )}
      >
        <h1 className="m-4 text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
          Price Smarter, Sell bigger!
        </h1>
        <p className="text-lg lg:text-3xl mex-w-screen-xl">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </p>

        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Get started for free
            <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </section>

      <section
        className={cn(
          'bg-primary text-primary-foreground',
          'px-8 md:px-16 py-16 flex flex-col gap-16 container',
        )}
      >
        <h2 className="text-3xl text-center text-balance">
          Trusted by top modern companies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
          <Link href="https://neon.tech">
            <Neon />
          </Link>
          <Link href="https://neon.tech">
            <ClerkIcon />
          </Link>
          <Link href="https://neon.tech">
            <Neon />
          </Link>
          <Link href="https://neon.tech">
            <ClerkIcon />
          </Link>
          <Link href="https://neon.tech">
            <Neon />
          </Link>
          <Link href="https://neon.tech">
            <ClerkIcon />
          </Link>
          <Link href="https://neon.tech">
            <Neon />
          </Link>
          <Link href="https://neon.tech">
            <ClerkIcon />
          </Link>
          <Link href="https://neon.tech">
            <Neon />
          </Link>
          <Link href="https://neon.tech" className="md:max-xl:hidden">
            <ClerkIcon />
          </Link>
        </div>
      </section>

      <section className="px-8 py-16 bg-accent/5">
        <h2 className="text-4xl font-semibold text-center text-balance pb-8">
          Pricing software which pays for itself 20x over
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl">
          {subscriptionTiersInOrder.map((subscriptionTier) => (
            <PricingCard
              key={subscriptionTier.name}
              name={subscriptionTier.name}
              priceInCents={subscriptionTier.priceInCents}
              maxNumberOfProducts={subscriptionTier.maxNumberOfProducts}
              maxNumberOfVisits={subscriptionTier.maxNumberOfVisits}
              canAccessAnalytics={subscriptionTier.canAccessAnalytics}
              canCustomizeBanner={subscriptionTier.canCustomizeBanner}
              canRemoveBranding={subscriptionTier.canCustomizeBanner}
              isMostPopular={subscriptionTier.name === 'Standard'}
            />
          ))}
        </div>
      </section>
    </>
  );
}
export default page;
