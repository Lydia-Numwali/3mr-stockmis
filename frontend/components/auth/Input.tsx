"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UseFormRegister } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prevIcon?: string;
  backIcon?: string;
  placeholder?: string;
  backIconInfo?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegister<any>;
  type?: string;
  label?: string;
  required?: boolean;
}
function Input({
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  register,
  prevIcon,
  backIcon,
  label,
  required,
  backIconInfo,
  ...props
}: InputProps) {
  const [newTypes, setNewTypes] = React.useState<string>(type);
  const handleTooglePassword = () => {
    setNewTypes(newTypes === "text" ? "password" : "text");
  };
  return (
    <div className="flex w-full flex-col gap-[6px]">
      {label && (
        <label
          htmlFor={label}
          className="text-sm font-urbanist text-[#081129DB] text-[18px] font-[400] pb-1"
        >
          {label}
          {required && <span className="text-[#FF0000]">*</span>}
        </label>
      )}
      <div className="flex border-[#4D4D4D40] rounded-xl h-[50px]  px-[18px] w-full 	 border items-center gap-[10px]">
        {prevIcon && (
          <Icon
            className="text-[#484F60]"
            icon={prevIcon}
            width={24}
            height={24}
          />
        )}
        <input
          type={type == "password" ? newTypes : type}
          placeholder={placeholder}
          value={value}
          {...(register && name ? register(name) : {})}
          onChange={onChange}
          className={`px-1 flex-1 w-full outline-none ${
            type == "password" && ""
          }`}
          {...props}
        />
        {type === "password" && (
          <button
            onClick={handleTooglePassword}
            type="button"
            className="flex items-center justify-center w-[40px] h-[40px] rounded-xl mx-[-10px] hover:bg-[#E6E6E6]"
          >
            {newTypes == "password" ? (
              <Icon
                className="text-[#484F60]"
                icon="solar:eye-closed-outline"
                width={24}
                height={24}
              />
            ) : (
              <Icon
                className="text-[#484F60]"
                icon="solar:eye-outline"
                width={24}
                height={24}
              />
            )}
          </button>
        )}

        {backIcon && (
          <HoverCard>
            <HoverCardTrigger>
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
}

export default Input;
