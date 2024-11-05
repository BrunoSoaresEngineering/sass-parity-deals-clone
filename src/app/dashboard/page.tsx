import { getProducts } from '@/repositories/product';
import { auth } from '@clerk/nextjs/server';
import NoProducts from './_components/No-products';

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
    <div>page</div>
  );
}
export default page;
