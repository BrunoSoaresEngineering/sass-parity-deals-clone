import { auth } from '@clerk/nextjs/server';
import ProductSection from '../_components/Product-section';

async function Products() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  return <ProductSection userId={userId} />;
}
export default Products;
