import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  Loader2,
  FileDown,
  XCircle,
  Ban,
  BadgeCheck,
  BadgeX,
  CheckCircle2,
  Printer,
} from "lucide-react";

// Import your images
import trashIcon from "@/public/images/modals/trash.png";
import checkIcon from "@/public/images/modals/check.png";
import deactivateIcon from "@/public/images/modals/deactivate.png";

// Types
type BulkActionType =
  | "export"
  | "delete"
  | "activate"
  | "deactivate"
  | "approve"
  | "reject"
  | "blacklist"
  | "whitelist"
  | "revoke"
  | "collect"
  | "print";

interface BulkConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: BulkActionType;
  entityLabel: string; // e.g. "employee", "badge", "visitor"
  count?: number;
  loading?: boolean;
  customDescription?: string;
}

const ACTION_CONFIG: Record<
  BulkActionType,
  {
    getTitle: (entity: string, count?: number) => string;
    getDescription: (entity: string, count?: number) => string;
    confirmText: string;
    variant: "default" | "destructive" | "success" | "warning";
    primaryColor: string;
    gradient: string[];
    iconType: "image" | "iconify" | "lucide";
    icon: any; // ImageStaticImport | string | ReactNode
  }
> = {
  export: {
    getTitle: (entity, count) =>
      `Export ${
        count
          ? `${count} ${entity}${count > 1 ? "s" : ""}`
          : `Selected ${entity}s`
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to export ${
        count
          ? `${count} ${entity}${count > 1 ? "s" : ""}`
          : `the selected ${entity}s`
      }?`,
    confirmText: "Export",
    variant: "success",
    primaryColor: "#13B04C",
    gradient: ["#F0FFF4", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <FileDown className="text-green-600" size={100} />,
  },
  delete: {
    getTitle: (entity, count) =>
      `Delete ${count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity}`,
    getDescription: (entity, count) =>
      `Are you sure you want to delete ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : `this ${entity}`
      }? This action cannot be undone.`,
    confirmText: "Delete",
    variant: "destructive",
    primaryColor: "#BA0101",
    gradient: ["#FFF2F2", "#FFFFFF", "#FFFFFF"],
    iconType: "image",
    icon: trashIcon,
  },
  activate: {
    getTitle: (entity, count) =>
      `Activate ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to activate ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Activate",
    variant: "default",
    primaryColor: "#13B04C",
    gradient: ["#C9F2D8", "#FFFFFF", "#FFFFFF"],
    iconType: "image",
    icon: checkIcon,
  },
  deactivate: {
    getTitle: (entity, count) =>
      `Deactivate ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to deactivate ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Deactivate",
    variant: "destructive",
    primaryColor: "#F9C015",
    gradient: ["#FDF7F2", "#FFFFFF", "#FFFFFF"],
    iconType: "image",
    icon: deactivateIcon,
  },
  approve: {
    getTitle: (entity, count) =>
      `Approve ${count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity}`,
    getDescription: (entity, count) =>
      `Are you sure you want to approve ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Approve",
    variant: "success",
    primaryColor: "#13B04C",
    gradient: ["#F0FFF4", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <CheckCircle2 className="text-green-600" size={100} />,
  },
  reject: {
    getTitle: (entity, count) =>
      `Reject ${count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity}`,
    getDescription: (entity, count) =>
      `Are you sure you want to reject ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Reject",
    variant: "destructive",
    primaryColor: "#BA0101",
    gradient: ["#FFF2F2", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <XCircle className="text-red-600" size={100} />,
  },
  blacklist: {
    getTitle: (entity, count) =>
      `Blacklist ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to blacklist ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Blacklist",
    variant: "destructive",
    primaryColor: "#BA0101",
    gradient: ["#FFF2F2", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <Ban className="text-red-600" size={100} />,
  },
  whitelist: {
    getTitle: (entity, count) =>
      `Whitelist ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to whitelist ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Whitelist",
    variant: "default",
    primaryColor: "#13B04C",
    gradient: ["#F0FFF4", "#FFFFFF", "#FFFFFF"],
    iconType: "iconify",
    icon: "fluent:globe-32-regular",
  },
  revoke: {
    getTitle: (entity, count) =>
      `Revoke ${count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity}`,
    getDescription: (entity, count) =>
      `Are you sure you want to revoke ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Revoke",
    variant: "warning",
    primaryColor: "#F9C015",
    gradient: ["#FDF7F2", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <BadgeX className="text-yellow-600" size={100} />,
  },
  collect: {
    getTitle: (entity, count) =>
      `Collect ${count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity}`,
    getDescription: (entity, count) =>
      `Are you sure you want to collect ${
        count ? `${count} ${entity}${count > 1 ? "s" : ""}` : entity
      }?`,
    confirmText: "Collect",
    variant: "success",
    primaryColor: "#13B04C",
    gradient: ["#F0FFF4", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <BadgeCheck className="text-green-600" size={100} />,
  },
  print: {
    getTitle: (entity, count) =>
      `Print ${
        count
          ? `${count} ${entity}${count > 1 ? "s" : ""}`
          : `Selected ${entity}s`
      }`,
    getDescription: (entity, count) =>
      `Are you sure you want to Print ${
        count
          ? `${count} ${entity}${count > 1 ? "s" : ""}`
          : `the selected ${entity}s`
      }?`,
    confirmText: "Print",
    variant: "success",
    primaryColor: "#13B04C",
    gradient: ["#F0FFF4", "#FFFFFF", "#FFFFFF"],
    iconType: "lucide",
    icon: <Printer className="text-green-600" size={100} />,
  },
};

export default function BulkConfirmDialog({
  open,
  onConfirm,
  onCancel,
  type,
  entityLabel,
  count,
  loading,
  customDescription,
}: BulkConfirmDialogProps) {
  const config = ACTION_CONFIG[type];

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="rounded-[30px] transition-all duration-300 shadow-xl">
        <div
          className="absolute inset-0 m-3 rounded-[30px] -z-50"
          style={{
            background: `linear-gradient(to bottom, ${config.gradient.join(
              ", "
            )})`,
            zIndex: -1,
          }}
        ></div>
        <div className="px-1 py-2 relative z-10">
          <DialogHeader className="flex flex-col">
            <DialogTitle className="text-[32px] font-semibold">
              {config.getTitle(entityLabel, count)}
            </DialogTitle>
            <DialogDescription className="text-secondary-gray text-[16px]">
              {customDescription || config.getDescription(entityLabel, count)}
            </DialogDescription>
            <div className="flex justify-center mt-5">
              {config.iconType === "image" && (
                <Image
                  src={config.icon}
                  alt={`${type}-icon`}
                  className="w-[180px] h-[180px] self-center"
                />
              )}
              {config.iconType === "iconify" && (
                <Icon
                  icon={config.icon}
                  className="text-[100px]"
                  color={config.primaryColor}
                />
              )}
              {config.iconType === "lucide" && config.icon}
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl px-5 py-6"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={config.variant!}
              style={{ backgroundColor: config.primaryColor, color: "white" }}
              onClick={onConfirm}
              className="rounded-xl px-5 py-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                config.confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
