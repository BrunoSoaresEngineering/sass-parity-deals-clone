import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from './ui/card';
import { Button } from './ui/button';

type NoPermissionCardProps = {
  children?: ReactNode
}
function NoPermissionCard({
  children = 'You do not have permission to perform this action. Upgrade now your account to access to this feature!',
}: NoPermissionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Permission Denied</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{children}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/dashboard/subscription">Upgrade Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
export default NoPermissionCard;
