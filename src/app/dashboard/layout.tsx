import type { ReactNode } from 'react';
import NavbarDashboard from './_components/Navbar-dashboard';

type DashboardLayoutProps = {
  children: ReactNode
}
function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-accent/5 min-h-screen">
      <NavbarDashboard />
      <div className="container py-6">
        {children}
      </div>
    </div>
  );
}
export default DashboardLayout;
