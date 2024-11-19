import { notFound } from 'next/navigation';
import ProductCustomizationForm from '@/app/dashboard/_components/forms/Product-customization';
import customization from '@/repositories/customization';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  productId: string,
  userId: string,
}

async function CustomizationTab ({ productId, userId }: Props) {
  const customizationData = await customization.getByProductId({ productId, userId });

  if (!customizationData) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm customization={customizationData} />
      </CardContent>
    </Card>
  );
}
export default CustomizationTab;
