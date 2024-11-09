'use client';

import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteProduct } from '@/server/actions/products';
import { useTransition } from 'react';

type DeleteProductAlertDialogContentProps = {
  id: string
}

function DeleteProductAlertDialogContent({ id }: DeleteProductAlertDialogContentProps) {
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone! This will permanently delete this product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => startDeleteTransition(async () => {
            const data = await deleteProduct(id);
            toast({
              title: data.error ? 'Error' : 'Success',
              description: data.message,
              variant: data.error ? 'destructive' : 'default',
            });
          })}
          disabled={isPendingDelete}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
export default DeleteProductAlertDialogContent;
