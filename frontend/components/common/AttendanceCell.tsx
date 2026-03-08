import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Clock, Calendar, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

// Define the possible attendance status options

export type AttendanceStatus = "P" | "A" | "LP" | "H" | "L" | "W" | "";
export type AttendanceEntry = {
  status: AttendanceStatus;
  name?: string;
  duration?: string;
  checkInTime?:string;
  checkOutTime?:string;
};

export const statusFullNameMap: Record<AttendanceStatus, string> = {
  P: "Present",
  A: "Absent",
  LP: "Late Present",
  L: "Leave",
  W: "Weekend",
  H: "Holiday",
  "": "Unknown",
};

interface AttendanceCellProps {
  status: AttendanceStatus;
  name?: string;
  duration?: string;
  onStatusChange?: (newStatus: AttendanceStatus) => void;
  readonly?: boolean;
}

const AttendanceCell: React.FC<AttendanceCellProps> = ({
  status,
  onStatusChange = () => {},
  readonly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define status-based styling
  const getStatusStyles = () => {
    const baseClasses = "w-8 h-8 flex items-center justify-center";

    switch (status) {
      case "P":
        return `bg-green-500 ${baseClasses} text-white`;
      case "A":
        return `bg-red-500 text-white ${baseClasses}`;
      case "LP":
        return `bg-yellow-400 ${baseClasses}`;
      case "H":
        return `bg-purple-600 text-white ${baseClasses}`;
      case "L":
        return `bg-indigo-500 text-white ${baseClasses}`;
      case "W":
        return `bg-gray-300 ${baseClasses}`;
      default:
        return `bg-white border border-gray-200 ${baseClasses}`;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "P":
        return <Check size={16} />;
      case "A":
        return <X size={16} />;
      case "LP":
        return <Clock size={16} />;
      case "H":
        return <Calendar size={16} />;
      case "L":
        return <Calendar size={16} />;
      case "W":
        return <Sun size={16} />;
      default:
        return null;
    }
  };

  const getStatusDisplay = () => {
    if (status) {
      return status;
    }
    return null;
  };

  const handleSelect = (value: AttendanceStatus) => {
    if (!readonly) {
      onStatusChange(value);
      setIsOpen(false);
    }
  };

  // If readonly, just display the status without dropdown
  if (readonly) {
    return (
      <div className="flex items-center justify-center py-2">
        <div
          className={cn(
            getStatusStyles(),
            "cursor-pointer rounded-md font-medium"
          )}
        >
          {getStatusDisplay() || getStatusIcon()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={getStatusDisplay() === null}
            className={cn(getStatusStyles(), "  cursor-pointer")}
          >
            {getStatusDisplay() || getStatusIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-40 bg-white">
          <DropdownMenuItem
            onClick={() => handleSelect("P")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-500 w-6 h-6 flex items-center justify-center  ">
                <Check size={16} className="text-white" />
              </div>
              <span>Present</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("A")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-500 w-6 h-6 flex items-center justify-center  ">
                <X size={16} className="text-white" />
              </div>
              <span>Absent</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("LP")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 w-6 h-6 flex items-center justify-center  ">
                <Clock size={16} />
              </div>
              <span>Late Present</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("H")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 w-6 h-6 flex items-center justify-center  ">
                <Calendar size={16} className="text-white" />
              </div>
              <span>Holiday</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("L")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-indigo-500 w-6 h-6 flex items-center justify-center  ">
                <Calendar size={16} className="text-white" />
              </div>
              <span>Leave</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("W")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 w-6 h-6 flex items-center justify-center  ">
                <Sun size={16} />
              </div>
              <span>Weekend</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSelect("")}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white border border-gray-200 w-6 h-6 flex items-center justify-center  "></div>
              <span>Clear</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AttendanceCell;
