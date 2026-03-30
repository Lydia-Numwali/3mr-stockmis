"use client";

import { Button } from "@/components/ui/button";
import CustomCalendar from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import * as React from "react";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
}

export default function DateRangeFilter({
  value,
  onChange,
  placeholder = "Select date range",
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange>(value);

  const handleApply = () => {
    onChange(tempRange);
    setOpen(false);
  };

  const handleClear = () => {
    const emptyRange = { from: undefined, to: undefined };
    setTempRange(emptyRange);
    onChange(emptyRange);
    setOpen(false);
  };

  const formatDateRange = () => {
    if (value.from && value.to) {
      return `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd, yyyy")}`;
    }
    if (value.from) {
      return `From ${format(value.from, "MMM dd, yyyy")}`;
    }
    if (value.to) {
      return `Until ${format(value.to, "MMM dd, yyyy")}`;
    }
    return placeholder;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-12 min-w-[200px]",
            !value.from && !value.to && "text-muted-foreground"
          )}
        >
          <Icon icon="solar:calendar-outline" className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium">Select Date Range</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">From</label>
              <CustomCalendar
                selectedDate={tempRange.from || null}
                setSelectedDate={(date) => 
                  setTempRange(prev => ({ ...prev, from: date || undefined }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">To</label>
              <CustomCalendar
                selectedDate={tempRange.to || null}
                setSelectedDate={(date) => 
                  setTempRange(prev => ({ ...prev, to: date || undefined }))
                }
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}