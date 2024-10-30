import Link from 'next/link';
import BrandLogo from '@/components/Brand-logo';

function Navbar() {
  return (
    <header className="w-full py-6 shadow-xl fixed top-0 bg-background/95">
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

        <Link className="text-lg" href="/">
          Login
        </Link>
      </nav>
    </header>
  );
}
export default Navbar;
