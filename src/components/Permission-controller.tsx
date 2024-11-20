import type { AwaitedReactNode } from 'react';
import { auth } from '@clerk/nextjs/server';
import NoPermissionCard from './No-permission-card';

type PermissionControllerProps = {
  children: AwaitedReactNode,
  permission: (userId: string | null | undefined) => Promise<boolean>,
  renderFallback?: boolean,
  fallbackText?: string,
}

async function PermissionController({
  children,
  permission,
  renderFallback = false,
  fallbackText,
}: PermissionControllerProps) {
  const { userId } = await auth();
  const hasPermission = await permission(userId);

  if (hasPermission) {
    return children;
  }

  if (renderFallback) {
    return (
      <NoPermissionCard>{fallbackText}</NoPermissionCard>
    );
  }

  return null;
}
export default PermissionController;
