import React from "react";
import { DashboardBarChart } from "@/components/charts/DashboardBarChart";
import { DashboardPieChart } from "@/components/charts/DashboardPieChart";
import { DashboardStatsCards } from "@/components/charts/DashboardStatsCards";

const DashboardPage = () => {
  return (
    <section className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Overview</h1>
      <DashboardStatsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <DashboardBarChart />
        <DashboardPieChart />
      </div>
    </section>
  );
};

export default DashboardPage;
