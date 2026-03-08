'use client';

import { TrendingUp, TrendingDown, BarChart2Icon } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useSalesChart } from "@/hooks/useDashboard"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

export const description = 'Revenue Trend';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#001526',
  },
} satisfies ChartConfig;

export function DashboardBarChart() {
  const t = useTranslations("dashboards.admin_dashboard");
  const { data, isLoading, isError } = useSalesChart('month');

  // Transform and group data
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item: any) => {
      const date = new Date(item.month);
      return {
        period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Number(item.revenue),
      };
    });
  }, [data]);

  if (isError) {
    return (
      <Card className="p-4 py-8  rounded-2xl border border-gray-200 shadow">
        <CardHeader>
          <CardTitle className="pb-2">Revenue Trend</CardTitle>
          <CardDescription>Failed to fetch revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-destructive">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 py-8  rounded-2xl border border-gray-200 shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="pb-2">Revenue Trend</CardTitle>
            <CardDescription>
              Showing monthly revenue trend for the last 6 months
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : chartData.length === 0 ? (
          <div className="h-80 flex flex-col gap-2 items-center justify-center text-muted-foreground">
            <BarChart2Icon size={25} />
            No data for the selected range
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              width={Math.max(500, chartData.length * 60)}
              height={350}
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: -20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="revenue" fill="#49b2ec" radius={10} barSize={90}>
                <LabelList
                  dataKey="revenue"
                  content={({ x, y, value, width }) => {
                    if (
                      value == null ||
                      x == null ||
                      y == null ||
                      width == null
                    )
                      return null;

                    const cx = Number(x) + Number(width) / 2;
                    const cy = Number(y) - 8;

                    return (
                      <text
                        x={cx}
                        y={cy}
                        fill="#333"
                        fontSize={12}
                        textAnchor="middle"
                      >
                        {Number(value).toLocaleString()}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
