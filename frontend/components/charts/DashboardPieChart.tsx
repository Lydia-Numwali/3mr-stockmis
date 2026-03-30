'use client';

import * as React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Label, Pie, PieChart, Sector, Cell } from 'recharts';
import { useCategoryBreakdown } from '@/hooks/useDashboard';
import { useInstitution } from '@/context/InstitutionContext';
import { useAuth } from '@/context/auth/auth-provider';
import { useRouter } from '@/i18n/routing';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export const description = 'Category Breakdown';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
];

const chartConfig = {
  category: { label: 'Category' }
} satisfies ChartConfig;

export function DashboardPieChart() {
  const router = useRouter();
  const t = useTranslations('dashboards.admin_dashboard');
  const {
    data: categoryData,
    isLoading,
    error,
  } = useCategoryBreakdown();

  const handleCategoryClick = (category: string) => {
    // Navigate to products relative to the current route or hardcoded
    const baseRoute = '/products';
    const queryString = new URLSearchParams({ category }).toString();
    router.push(`${baseRoute}?${queryString}`);
  };

  const chartData = React.useMemo(() => {
    if (!categoryData || !Array.isArray(categoryData)) return [];

    return categoryData.map((item: any, index: number) => ({
      category: item.category || 'Uncategorized',
      count: Number(item.totalQty) || 0,
      fill: COLORS[index % COLORS.length],
    })).filter(item => item.count > 0);
  }, [categoryData]);

  const totalCount = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const hasData = totalCount > 0;
  if (isLoading) {
    return (
      <Card className="p-4 py-8 rounded-2xl border border-gray-200 shadow h-[540px]">
        <CardHeader className="items-center pb-0 flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription className='pt-2'>Loading stock categories...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-pulse">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !categoryData) {
    return (
      <Card className="p-4 py-8 rounded-2xl border border-gray-200 shadow h-[540px]">
        <CardHeader className="items-center pb-0 flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription className='pt-2'>Failed to load data</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <PieChartIcon className="w-12 h-12" />
          <p className="text-lg font-medium">{t('failed_to_get_stats')}</p>
          <p className="text-sm text-center">No category data available</p>
        </CardContent>
      </Card>
    );
  }

  // Show chart with data
  return (
    <Card className="p-4 py-8 rounded-2xl border border-gray-200 shadow h-[540px] flex flex-col">
      <CardHeader className="items-center pb-0 flex flex-col sm:flex-row justify-between">
        <div>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription className='pt-2'>Stock division by categories</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {!hasData && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <PieChartIcon className="w-12 h-12" />
            <p className="text-lg font-medium">No stock data available</p>
            <p className="text-sm text-center">
              Add products with categories to see breakdown
            </p>
          </div>
        )}

        {hasData && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="category"
                innerRadius="48%"
                outerRadius="85%"
                strokeWidth={5}
                onClick={(data) => handleCategoryClick(data.category)}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick(entry.category)}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Items
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={({ payload }) => (
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {payload?.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:opacity-80"
                        onClick={() => handleCategoryClick(entry.payload?.category)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-foreground">
                          {entry.payload?.category}
                        </span>
                        <span className="text-muted-foreground">
                          ({entry.payload?.count?.toLocaleString()})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
