import type { ReactNode } from 'react';
import Navbar from './_components/Navbar';

function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
export default layout;
