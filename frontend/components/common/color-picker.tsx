import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPickerField({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Label + Color Square */}
      <div
        className="flex items-center justify-between gap-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <label className="text-sm">{label}</label>
        <div
          className="w-8 h-8 rounded border border-gray-300"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Popup Picker */}
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
