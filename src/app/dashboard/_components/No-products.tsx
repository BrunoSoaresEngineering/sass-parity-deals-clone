import { Button } from '@/components/ui/button';
import Link from 'next/link';

function NoProducts() {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">You have no products</h1>
      <p className="mb-4">
        Get started with PPP discounts by creating a product
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard/products/new">Add Product</Link>
      </Button>
    </div>
  );
}
export default NoProducts;
