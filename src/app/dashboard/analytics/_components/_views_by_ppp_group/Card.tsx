import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getViewsByPPPGroup } from '@/repositories/product-views';
import ViewsByPPPGroupChart from './Chart';

async function ViewsByPPPGroupCard(props: Parameters<typeof getViewsByPPPGroup>[0]) {
  const chartData = await getViewsByPPPGroup(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per PPP Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByPPPGroupChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

export default ViewsByPPPGroupCard;
