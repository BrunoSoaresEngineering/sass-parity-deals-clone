import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type FeatureProps = {
  children: ReactNode,
  className?: string,
}
function Feature({ children, className }: FeatureProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}
export default Feature;
