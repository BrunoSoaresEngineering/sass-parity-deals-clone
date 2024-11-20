import { getProducts } from '@/repositories/product';
import { auth } from '@clerk/nextjs/server';
import NoProducts from './_components/No-products';
import ProductSection from './_components/Product-section';

async function page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }
  const products = await getProducts(userId);

  if (products.length === 0) {
    return <NoProducts />;
  }
  return (
    <ProductSection userId={userId} titleHref="/dashboard/products" />
  );
}
export default page;
