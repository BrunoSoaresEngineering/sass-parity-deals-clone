import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getViewsByCountry } from '@/repositories/product-views';
import ViewsByCountryChart from './Chart';

async function ViewsByCountryCard(props: Parameters<typeof getViewsByCountry>[0]) {
  const chartData = await getViewsByCountry(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
export default ViewsByCountryCard;
