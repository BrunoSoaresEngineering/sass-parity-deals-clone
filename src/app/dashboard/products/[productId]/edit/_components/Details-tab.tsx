import ProductDetailsForm from '@/app/dashboard/_components/forms/Product-details-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  product: {
    id: string,
    name: string,
    url: string,
    description: string | null,
  }
}

function DetailsTab({ product }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  );
}

export default DetailsTab;
