import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import { SelectMenuOption } from "@/lib/country-types";
import { useState } from "react";

export interface CountrySelectorProps {
  id: string;
  open: boolean;
  disabled?: boolean;
  onToggle: (open: boolean) => void;
  onChange: (value: SelectMenuOption) => void;
  selectedValue: SelectMenuOption;
  className?: string;
}

export default function CountrySelector({
  id,
  open,
  disabled = false,
  onToggle,
  onChange,
  selectedValue,
  className,
}: CountrySelectorProps) {
  const [query, setQuery] = useState("");

  return (
    <Popover open={open} onOpenChange={onToggle}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between border border-[#4D4D4D40] rounded-xl px-3 py-3 text-sm",
            disabled ? "bg-transparent cursor-not-allowed" : "bg-transparent",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <img
              alt={selectedValue?.value ?? "No flag"}
              src={
                selectedValue?.value
                  ? `https://flagcdn.com/w40/${selectedValue.value.toLowerCase()}.png`
                  : "/placeholder-flag.png"
              }
              className="h-4 w-6 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {selectedValue.title}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[300px]">
        <Command shouldFilter={false}>
          <div className="sticky top-0 z-10 bg-white px-2 pt-2 pb-1">
            <CommandInput
              placeholder="Search a country"
              value={query}
              onValueChange={setQuery}
            />
          </div>

          <CommandList className="max-h-64 overflow-y-auto">
            <CommandEmpty>No countries found</CommandEmpty>

            {COUNTRIES.filter((country) =>
              country.title.toLowerCase().startsWith(query.toLowerCase())
            ).map((country, index) => (
              <CommandItem
                key={`${id}-${index}`}
                value={country.value}
                onSelect={() => {
                  onChange(country);
                  setQuery("");
                  onToggle(false);
                }}
                className="flex items-center gap-2"
              >
                <img
                  alt={country.value}
                  src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
                  className="h-4 w-6 rounded-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="truncate">{country.title}</span>

                {country.value === selectedValue.value && (
                  <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
