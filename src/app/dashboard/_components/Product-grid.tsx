import ProductCard, { Product } from './Product-card';

type ProductGridProps = {
  products: Product[]
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
export default ProductGrid;
