import React from "react";
import { DashboardBarChart } from "@/components/charts/DashboardBarChart";
import { DashboardPieChart } from "@/components/charts/DashboardPieChart";
import { useTranslations } from "next-intl";

const DashboardPage = () => {
  return (
    <section className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <DashboardBarChart />
        <DashboardPieChart />
      </div>
    </section>
  );
};

export default DashboardPage;
