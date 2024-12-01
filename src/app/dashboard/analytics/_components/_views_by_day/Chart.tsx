'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCompactNumber } from '@/lib/fomatters';
import { cn } from '@/lib/utils';

type ViewsByDayChartProps = {
  chartData: {
    date: string,
    views: number
  }[]
}
function ViewsByDayChart({ chartData }: ViewsByDayChartProps) {
  const chartConfig = {
    views: {
      label: 'Visitors',
      color: 'hsl(var(--accent))',
    },
  };

  if (chartData.length === 0) {
    return (
      <p className={cn(
        'flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px]',
      )}
      >
        No data available
      </p>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-[250px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <XAxis dataKey="date" tickLine={false} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="views"
          fill="var(--color-views)"
        />
      </BarChart>
    </ChartContainer>
  );
}
export default ViewsByDayChart;
