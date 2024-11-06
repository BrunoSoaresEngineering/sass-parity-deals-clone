import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PageWithBackButton from '../../_components/Page-with-back-button';
import ProductDetailsForm from '../../_components/forms/Product-details-form';

function page() {
  return (
    <PageWithBackButton backButtonHref="/dashboard/products" pageTitle="Create Product">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDetailsForm />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
export default page;
