import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/repositories/product';
import { auth } from '@clerk/nextjs/server';
import ProductGrid from '../_components/Product-grid';
import NoProducts from '../_components/No-products';

async function Products() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const products = await getProducts(userId);

  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <div className="flex justify-between mb-6 text-3xl font-semibold">
        <h1>Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>
      <ProductGrid products={products} />
    </>
  );
}
export default Products;
