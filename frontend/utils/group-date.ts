// utils/groupData.ts
import { parseISO, format, startOfWeek, startOfMonth } from "date-fns";

export type VisitorEntry = {
  date: string;  // ISO string date
  count: number;
};

/**
 * Group daily visitor data by week or month and sum counts.
 * @param data - array of daily visitor entries
 * @param groupBy - 'week' or 'month'
 * @returns grouped array with aggregated counts
 */
export function groupData(
  data: VisitorEntry[],
  groupBy: "week" | "month"
): { date: string; visitorCount: number }[] {
  const grouped: Record<string, number> = {};

  data.forEach(({ date, count }) => {
    const parsedDate = parseISO(date);
    let key = "";

    if (groupBy === "week") {
      // Start of the week, Monday as first day
      const weekStart = startOfWeek(parsedDate, { weekStartsOn: 1 });
      key = format(weekStart, "yyyy-MM-dd");
    } else if (groupBy === "month") {
      const monthStart = startOfMonth(parsedDate);
      key = format(monthStart, "yyyy-MM");
    }

    grouped[key] = (grouped[key] || 0) + count;
  });

  return Object.entries(grouped).map(([date, visitorCount]) => ({
    date,
    visitorCount,
  }));
}
