import React, { useState } from "react";
import { CustomDatepicker } from "./CustomDatepicker";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface EmployeeTableFilterProps {
  onFilterChange?: (filters: { fromDate: string; toDate: string }) => void;
}

const EmployeeTableFilter: React.FC<EmployeeTableFilterProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
    
    // Call the callback function if provided
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Filtering with:", filters);
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      fromDate: "",
      toDate: "",
    };
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <form
      className="w-full text-[#081129] border-t border-b border-[#E3E3E3] px-3 sm:px-5 py-3 flex gap-3 sm:gap-5 flex-wrap items-end justify-between mb-1"
      onSubmit={handleSearch}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">From</label>
        <CustomDatepicker
          value={filters.fromDate}
          onChange={(date) => handleInputChange("fromDate", date)}
          placeholder="Select a date"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">To</label>
        <CustomDatepicker
          value={filters.toDate}
          onChange={(date) => handleInputChange("toDate", date)}
          placeholder="Select a date"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="py-2 px-4 sm:py-3 sm:px-6 rounded-xl text-[#fff] bg-secondary-blue hover:bg-secondary-blue/80 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <Icon
            icon={"solar:magnifer-linear"}
            className="font-bold w-4 h-4 sm:w-5 sm:h-5"
          />
          Search
        </Button>

        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="py-2 px-3 sm:py-3 sm:px-4 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <Icon icon={"solar:refresh-linear"} className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default EmployeeTableFilter; 