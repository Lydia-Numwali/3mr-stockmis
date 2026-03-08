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

interface FormDatePickerProps {
  label?: string;
  error?: string;
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function FormDatePicker({
  label,
  error,
  value,
  onChange,
}: FormDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="block font-medium text-sm">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-12 border border-[#D0D5DD]",
              !value && "text-muted-foreground"
            )}
          >
            <Icon
              icon={"solar:calendar-outline"}
              className="mr-2 text-[#D0D5DD]"
            />
            {value ? (
              <span className="text-dark-navy">{format(value, "PPP")}</span>
            ) : (
              <span className="text-[#D0D5DD]">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CustomCalendar
            selectedDate={value}
            setSelectedDate={(date) => {
              if (date) {
                onChange(date);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
