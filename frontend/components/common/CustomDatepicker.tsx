"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar-shad";

interface CustomDatepickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  disabled?:boolean;
}

export function CustomDatepicker({
  value,
  onChange,
  placeholder = "Select a date",
  minDate,
  maxDate,
  className,
  disabled
}: CustomDatepickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange && selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    } else if (onChange && !selectedDate) {
      onChange("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal bg-transparent rounded-lg border !h-10",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className=""
          disabled={(date) => {
            // Disable dates before minDate
            if (minDate && date < new Date(minDate)) {
              return true;
            }
            // Disable dates after maxDate
            if (maxDate && date > new Date(maxDate)) {
              return true;
            }
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
