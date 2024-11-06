import type { ReactNode } from 'react';

type Props = {
  children: ReactNode
}
function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
}
export default AuthLayout;
