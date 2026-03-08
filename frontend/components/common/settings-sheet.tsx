import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { on } from "events";

type SettingsSheetsProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SettingsItemProps = {
  icon: string;
  name: string;
  iconbg: string;
  iconColor: string;
  href: string;
  onOpenChange?: ((open: boolean) => void)
};

  const settingsItems:SettingsItemProps[] = [
    {
      name: "Notifications",
      icon: "solar:bell-linear",
      iconbg: "#EEF3F1",
      iconColor: "#006B40",
      href: "#",
    },
    {
      name: "Two Factor Authentication",
      icon: "solar:shield-check-linear",
      iconbg: "#FFF4DE",
      iconColor: "#AED2C4",
      href: "/settings/two-factor-auth",
    }
  ];

const SettingsSheets: FC<SettingsSheetsProps> = ({ open, onOpenChange }) => {
  return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="py-5">
            <SheetHeader className="p-1 px-4">
              <SheetTitle/>
              <h2 className="text-xl font-semibold">Settings</h2>
            </SheetHeader>
          <div className="flex flex-col px-5 gap-4">
            <p className="text-gray-600">
              Manage your account settings and preferences.
            </p>
            <div className="flex flex-col gap-2">
              {settingsItems.map((item, idx) => (
                <SettingsItem
                  icon={item.icon}
                  iconColor={item.iconColor}
                  iconbg={item.iconbg}
                  name={item.name}
                  key={idx}
                  href={item.href}
                  onOpenChange={onOpenChange}
                />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
  );
};

export default SettingsSheets;

function SettingsItem({
  icon,
  name,
  href,
  iconColor,
  iconbg,
  onOpenChange
}: SettingsItemProps) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 justify-between p-4 border border-light-gray rounded-2xl"
        onClick={()=>onOpenChange?.(false)}
      >
        <div className="flex items-center gap-5">
          <div
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl"
            )}
            style={{ backgroundColor: iconbg }}
          >
            <Icon
              icon={icon}
              className="h-5 w-5 text-muted-foreground"
              color={iconColor}
            />
          </div>
          <h2 className="text-sm font-semibold">{name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            icon={"lucide:chevron-right"}
            className="h-5 w-5 text-muted-foreground"
          />
        </div>
      </Link>
    );
  }
