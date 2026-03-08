import React from "react";

export const OverviewSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white px-10 py-6">
      <h3 className="text-[28px] font-medium pb-2">Overview</h3>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-col gap-3 p-6">
            <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="flex items-center gap-2 pt-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex items-center gap-5 py-2">
              <div className="h-16 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
