"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CustomTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function CustomTimePicker({
  value,
  onChange,
  error,
  className,
  required,
}: CustomTimePickerProps) {
  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const times = generateTimeOptions();

  const handleTimeChange = (newTime: string) => {
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <div>
      <Select value={value} onValueChange={handleTimeChange}>
        <SelectTrigger
          className={cn(
            "w-full text-lg text-gray-600",
            error && "border-red-500",
            className
          )}
        >
          <Icon
            icon="mdi:clock-outline"
            className="mr-2 text-[#484F60]"
            width={24}
            height={24}
          />
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {times.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
