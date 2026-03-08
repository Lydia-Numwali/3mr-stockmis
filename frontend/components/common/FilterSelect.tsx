'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@iconify/react';

export type FilterOption = {
  value: string;
  label: string;
  icon?: string;
};

interface FilterSelectProps {
  filters: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  filters,
  value,
  onChange,
  placeholder = 'Filter',
  className,
}) => {
  const selectedLabel = filters.find((f) => f.value === value)?.label;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[150px] bg-white border-gray-300 !h-12 ${className || ''}`}>
        <div className="flex items-center gap-2">
          <Icon icon="mynaui:filter" width="20" height="20" />
          <span>{selectedLabel || placeholder}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.value} value={filter.value}>
            <div className="flex items-center gap-2">
              {filter.icon && <Icon icon={filter.icon} className="w-6 h-6 text-secondary-blue" />}
              <span className="text-[17px]">{filter.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
