"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar-shad";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CustomDatepickerProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function CustomRoundedDatePicker({
  label = "Date of visit",
  required = true,
  value,
  onChange,
  error
}: CustomDatepickerProps) {
  // Convert string date to Date object for the calendar
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onChange) {
      onChange(format(newDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between px-4 py-2 text-left rounded-xl border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              !date && "text-gray-500",
              error && "border-red-500"
            )}
          >
            <Icon
              icon="mdi:calendar-month-outline"
              className="mr-2 text-[#484F60]"
              width={24}
              height={24}
            />
            {date ? format(date, "PPP") : "Select Date"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
