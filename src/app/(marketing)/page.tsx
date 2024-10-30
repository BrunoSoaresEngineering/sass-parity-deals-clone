import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';

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

      <section />
    </>
  );
}
export default page;
