import React from "react";
import { Icon } from "@iconify/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  prevIcon?: string;
  backIcon?: string;
  placeholder?: string;
  backIconInfo?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

const TextArea = ({
  placeholder,
  value,
  onChange,
  error,
  prevIcon,
  backIcon,
  label,
  required,
  backIconInfo,
  ...props
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="text-sm font-urbanist text-[#081129DB] text-[18px] font-[400]"
      >
        {label}
        {required && <span className="text-[#FF0000]">*</span>}
      </label>
      <div className="relative pt-1">
        <textarea
          placeholder={placeholder}
          value={value}
          {...props}
          onChange={onChange}
          className={cn(
            "w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-0 min-h-[150px]",
            prevIcon && "pl-14"
          )}
        />
        {prevIcon && (
          <div className="absolute top-4 left-0 flex items-start pl-4 pointer-events-none">
            <Icon
              className="text-[#484F60]"
              icon={prevIcon}
              width={24}
              height={24}
            />
          </div>
        )}
        {backIcon && (
          <HoverCard>
            <HoverCardTrigger className="absolute top-4 right-0 flex items-start pr-4 pointer-events-none">
              <Icon
                icon={backIcon}
                width={24}
                height={24}
                className="text-[#484F60]"
              />
            </HoverCardTrigger>
            {backIconInfo && (
              <HoverCardContent>
                <p>{backIconInfo}</p>
              </HoverCardContent>
            )}
          </HoverCard>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextArea;
