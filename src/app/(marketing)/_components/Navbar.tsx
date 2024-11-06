import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import BrandLogo from '@/components/Brand-logo';

function Navbar() {
  return (
    <header className="w-full py-6 shadow-xl fixed top-0 bg-background/95 z-10">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link className="mr-auto" href="/">
          <BrandLogo />
        </Link>

        <Link className="text-lg" href="/">
          Features
        </Link>

        <Link className="text-lg" href="/">
          Pricing
        </Link>

        <Link className="text-lg" href="/">
          About
        </Link>

        <span className="text-lg">
          <SignedOut>
            <SignInButton>Login</SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
          </SignedIn>
        </span>
      </nav>
    </header>
  );
}
export default Navbar;
