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

type ViewsByPPPGroupChartProps = {
  chartData: {
    pppName: string,
    views: number
  }[]
}

function ViewsByPPPGroupChart({ chartData }: ViewsByPPPGroupChartProps) {
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

  const data = chartData.map((dataItem) => ({
    pppName: dataItem.pppName.replace('Parity Group: ', ''),
    views: dataItem.views,
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-[250px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="pppName" tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
}
export default ViewsByPPPGroupChart;
