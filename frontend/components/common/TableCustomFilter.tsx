import React, { FC, useState } from 'react';
import { CustomDatepicker } from './CustomDatepicker';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type props = {
  handleFilter?: (filterData: { startDate: string; endDate: string }) => void;
};
const TableCustomFilter: FC<props> = ({ handleFilter }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  // Mock data - in real app, this would come from API
  const institutions = [
    { id: '1', name: 'Charles' },
    { id: '2', name: 'University of Rwanda' },
    { id: '3', name: 'KIST' },
    { id: '4', name: 'RCA' },
  ];

  const departments = [
    { id: '1', name: 'Accounting' },
    { id: '2', name: 'Human Resources' },
    { id: '3', name: 'Engineering' },
    { id: '4', name: 'Marketing' },
    { id: '5', name: 'Operations' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilter?.({ startDate: filters.startDate, endDate: filters.endDate });
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    handleFilter?.({ startDate: '', endDate: '' });
  };

  return (
    <form
      className="w-full text-[#081129] border-t border-b border-[#E3E3E3] px-3 sm:px-5 py-3 flex gap-3 sm:gap-5 flex-wrap items-end justify-between mb-1"
      onSubmit={handleSearch}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">From</label>
        <CustomDatepicker
          value={filters.startDate}
          onChange={(date) => handleInputChange('startDate', date)}
          placeholder="Select a date"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">To</label>
        <CustomDatepicker
          value={filters.endDate}
          onChange={(date) => handleInputChange('endDate', date)}
          placeholder="May 8th, 2025"
        />
      </div>

      {/* <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">
          Institution name
        </label>
        <Select
          value={filters.institutionName}
          onValueChange={(value) => handleInputChange("institutionName", value)}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="University of Rwanda" />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((institution) => (
              <SelectItem key={institution.id} value={institution.name}>
                {institution.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-[160px] sm:min-w-[200px]">
        <label className="font-semibold text-xs sm:text-sm">Department</label>
        <Select
          value={filters.department}
          onValueChange={(value) => handleInputChange("department", value)}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Accounting" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="flex gap-2">
        <Button
          type="submit"
          className="py-2 h-full px-4 sm:py-3 sm:px-6 rounded-xl text-[#fff] bg-secondary-blue hover:bg-secondary-blue/80 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <Icon
            icon={'solar:magnifer-linear'}
            className="font-bold w-4 h-4 sm:w-5 sm:h-5"
          />
          Search
        </Button>

        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="py-2 px-3 !h-full sm:py-3 sm:px-4 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <Icon icon={'solar:refresh-linear'} className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default TableCustomFilter;
