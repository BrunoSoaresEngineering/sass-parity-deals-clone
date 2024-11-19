import { notFound } from 'next/navigation';
import ProductCustomizationForm from '@/app/dashboard/_components/forms/Product-customization';
import customization from '@/repositories/customization';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { checkCustomizeBanner, checkRemoveBranding } from '@/server/permissions';

type Props = {
  productId: string,
  userId: string,
}

async function CustomizationTab ({ productId, userId }: Props) {
  const customizationData = await customization.getByProductId({ productId, userId });

  if (!customizationData) {
    return notFound();
  }

  const canRemoveBranding = await checkRemoveBranding(userId);
  const canCustomizeBanner = await checkCustomizeBanner(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          customization={customizationData}
          canCustomizeBanner={canCustomizeBanner}
          canRemoveBranding={canRemoveBranding}
        />
      </CardContent>
    </Card>
  );
}
export default CustomizationTab;
