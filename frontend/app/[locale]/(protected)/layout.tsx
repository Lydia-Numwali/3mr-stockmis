"use client";

import React from "react";
import Sidebar from "@/components/common/sidebar";
import Heading from "@/components/common/heading";
import { usePathname } from "@/i18n/routing";
import { InstitutionProvider } from "@/context/InstitutionContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // Check if current route is an onboarding route
  const isOnboardingRoute = pathname.includes("/onboarding");

  // If it's an onboarding route, render with heading but without sidebar
  if (isOnboardingRoute) {
    return (
      <InstitutionProvider>
        <div className="h-screen bg-secondary-white flex flex-col">
          <Heading />
          <main className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </InstitutionProvider>
    );
  }

  // Default layout with sidebar and heading
  return (
    <InstitutionProvider>
      <div className="grid bg-secondary-white h-screen w-full lg:grid-cols-[270px_1fr]">
        <div className="hidden lg:block bg-secondary-blue text-white">
          <Sidebar />
        </div>
        <div className="flex flex-col overflow-y-auto relative overflow-x-hidden">
          <div className="sticky top-0 z-40">
            <Heading />
          </div>
          <main className="flex-1 flex flex-col gap-4 m-6 max-md:mx-3 mt-4 mb-6 lg:gap-6">
            {children}
          </main>
        </div>
      </div>
    </InstitutionProvider>
  );
};

export default DashboardLayout;
