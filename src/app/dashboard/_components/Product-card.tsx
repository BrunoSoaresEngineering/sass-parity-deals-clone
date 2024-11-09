import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import DeleteProductAlertDialogContent from './Delete-product-dialog-content';
import AddToSiteProductModalContent from './Add-to-site-product-modal-content';

export type Product = {
  id: string,
  name: string,
  description: string | null,
}

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            {product.name}
          </CardTitle>
          <Dialog>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 p-0">
                    <div className="sr-only">Action Menu</div>
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>

                  <DialogTrigger>
                    <DropdownMenuItem>Add to site</DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />

                  <AlertDialogTrigger>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DeleteProductAlertDialogContent id={product.id} />
            </AlertDialog>
            <AddToSiteProductModalContent id={product.id} />
          </Dialog>
        </div>
      </CardHeader>
      {product.description && <CardContent>{product.description}</CardContent>}
    </Card>
  );
}
export default ProductCard;
