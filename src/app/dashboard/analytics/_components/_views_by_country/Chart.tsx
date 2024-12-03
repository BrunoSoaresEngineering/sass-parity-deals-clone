'use client';

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/fomatters';

type ViewsByCountryChartProps = {
  chartData: {
    countryCode: string,
    countryName: string,
    views: number,
  }[]
}

function ViewsByCountryChart({ chartData }: ViewsByCountryChartProps) {
  const chartConfig = {
    views: {
      label: 'Visitors',
      color: 'hsl(var(--accent))',
    },
  };

  if (chartData.length === 0) {
    return (
      <p className={cn(
        'flex justify-center items-center text-muted-foreground min-h-[150px] max-h-[250px] w-full',
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
        <XAxis dataKey="countryCode" tickLine={false} />
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
export default ViewsByCountryChart;
