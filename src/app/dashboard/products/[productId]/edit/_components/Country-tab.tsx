import CountryDiscountsForm from '@/app/dashboard/_components/forms/Country-discounts-form';
import { getCountryGroupDiscountsByProduct } from '@/repositories/country-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CountryTabProps = {
  productId: string,
  userId: string,
}

async function CountryTab({ productId, userId }: CountryTabProps) {
  const countryGroups = await getCountryGroupDiscountsByProduct({ productId, userId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for any specific
          parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountsForm productId={productId} countryGroups={countryGroups} />
      </CardContent>
    </Card>
  );
}

export default CountryTab;
