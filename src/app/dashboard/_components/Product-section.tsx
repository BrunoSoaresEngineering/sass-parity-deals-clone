import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/repositories/product';
import ProductGrid from './Product-grid';
import NoProducts from './No-products';

type ProductSectionProps = {
  userId: string,
  titleHref?: string
};

async function ProductSection({ userId, titleHref }: ProductSectionProps) {
  const products = await getProducts(userId);

  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <div className="flex justify-between mb-6 text-3xl font-semibold">
        <h1>
          {titleHref && (
            <Link
              href={titleHref}
              className="flex gap-2 items-center hover:underline group"
            >
              Products
              <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {!titleHref && 'Products'}
        </h1>
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
export default ProductSection;
