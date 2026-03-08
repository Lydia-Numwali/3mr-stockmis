"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslations } from 'next-intl';

interface MonthlyData {
  year: number;
  month: number;
  count: number;
}

interface SparklineChartProps {
  primaryColor: string;
  data: MonthlyData[];
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  primaryColor,
  data,
}) => {
  const t = useTranslations("dashboards");
  
  const monthNames = [
    t("month_abbreviations.jan"),
    t("month_abbreviations.feb"),
    t("month_abbreviations.mar"),
    t("month_abbreviations.apr"),
    t("month_abbreviations.may"),
    t("month_abbreviations.jun"),
    t("month_abbreviations.jul"),
    t("month_abbreviations.aug"),
    t("month_abbreviations.sep"),
    t("month_abbreviations.oct"),
    t("month_abbreviations.nov"),
    t("month_abbreviations.dec"),
  ];

  const CustomTooltip = ({ active, payload, primaryColor }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
          <p className="font-semibold">{`${monthNames[data.month - 1]} ${
            data.year
          }`}</p>
          <p
            className="text-sm"
            style={{ color: primaryColor }}
          >{`Count: ${data.count}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) return;

  const chartData = [...data]
    .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
    .map((item) => ({
      ...item,
      name: `${monthNames[item.month - 1]} ${item.year}`,
      value: item.count,
    }));

  return (
    <ResponsiveContainer width={100} height={50}>
      <LineChart data={chartData}>
        <Line
          type="basis"
          dataKey="value"
          stroke={primaryColor}
          strokeWidth={4}
          dot={false}
          activeDot={{ r: 4, fill: primaryColor }}
        />
        <Tooltip
          content={<CustomTooltip primaryColor={primaryColor} />}
          wrapperStyle={{
            zIndex: 1000,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;
