import { notFound } from 'next/navigation';
import PageWithBackButton from '@/app/dashboard/_components/Page-with-back-button';
import { auth } from '@clerk/nextjs/server';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { getProduct } from '@/repositories/product';
import DetailsTab from './_components/Details-tab';
import CountryTab from './_components/Country-tab';
import CustomizationTab from './_components/Customization-tab';

type Props = {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function page({ params, searchParams }: Props) {
  const { productId } = await params;
  const { tab = 'details' } = await searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const product = await getProduct({ id: productId, userId });
  if (!product) {
    return notFound();
  }

  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Edit Product"
    >
      <Tabs defaultValue={Array.isArray(tab) ? tab[0] : tab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="countries">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="countries">
          <CountryTab userId={userId} productId={productId} />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationTab productId={productId} userId={userId} />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}

export default page;
