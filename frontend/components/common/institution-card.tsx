import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

type props = {
  isCollapsed?: boolean;
  size?: "large" | "small";
  name: string;
  imageUrl?: string | null;
};

const InstitutionCard: FC<props> = ({
  isCollapsed,
  size = "large",
  name,
  imageUrl,
}) => {
  const hasImage = imageUrl && imageUrl.trim() !== "";

  return (
    <div
      className={cn(
        "flex items-center gap-[14px] hover:bg-neutral-50 rounded-lg p-2 cursor-pointer"
      )}
    >
      {/* div displaying name initial in circle or image */}
      <div
        className={cn(
          "rounded-xl overflow-hidden border flex items-center justify-center",
          size === "small" ? "min-w-[40px] h-[40px]" : "min-w-[55px] h-[55px]",
          !hasImage && "bg-gray-200" // Add background color for initials
        )}
      >
        {hasImage ? (
          <Image
            src={`https://eu.ui-avatars.com/api/?name=${name}&size=${250}`}
            width={size === "small" ? 40 : 55}
            height={size === "small" ? 40 : 55}
            alt="userImage"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <span className="font-medium text-gray-600">
            {name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {/* div displaying name initial in circle or image */}

      {!isCollapsed && (
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold leading-[16px] text-dark-navy whitespace-nowrap">
            {name}
          </h2>
        </div>
      )}
    </div>
  );
};

export default InstitutionCard;
