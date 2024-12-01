import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getViewsByDay } from '@/repositories/product-views';
import ViewsByDayChart from './Chart';

async function ViewsByDayCard(props: Parameters<typeof getViewsByDay>[0]) {
  const chartData = await getViewsByDay(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
export default ViewsByDayCard;
