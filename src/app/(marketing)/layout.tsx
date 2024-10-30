import type { ReactNode } from 'react';
import Navbar from './_components/Navbar';

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="selection:bg-[hsl(320,65%,52%,20%)]">
      <Navbar />
      {children}
    </div>
  );
}
export default layout;
