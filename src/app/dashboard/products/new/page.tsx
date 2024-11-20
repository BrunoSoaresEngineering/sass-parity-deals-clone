import PermissionController from '@/components/Permission-controller';
import { checkCreateProduct } from '@/server/permissions';
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
      <PermissionController
        permission={checkCreateProduct}
        renderFallback
        fallbackText="You have already created the maximum number of products. Upgrade your account now to create more!"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </PermissionController>
    </PageWithBackButton>
  );
}
export default page;
