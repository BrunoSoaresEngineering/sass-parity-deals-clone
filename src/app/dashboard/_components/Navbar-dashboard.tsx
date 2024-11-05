import BrandLogo from '@/components/Brand-logo';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function NavbarDashboard() {
  return (
    <header className="py-4 shadow bg-background">
      <nav className="flex items-center gap-10 container">
        <Link className="mr-auto" href="/dashboard">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        <UserButton />
      </nav>
    </header>
  );
}
export default NavbarDashboard;
