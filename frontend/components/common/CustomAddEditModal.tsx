import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type props = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
};

const CustomAddEditModal: FC<props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[30px] transition-all duration-300 shadow-xl">
        <div
          className="absolute inset-0 m-3 rounded-[30px] -z-50"
          style={{
            background: `linear-gradient(to bottom, ${[
              "#EEF3FF",
              "#FFFFFF",
              "#FFFFFF",
            ].join(", ")})`,
            zIndex: -1,
          }}
        ></div>

        <div className="px-1 py-2 relative z-10">
          <DialogHeader className="flex flex-col">
            <DialogTitle className="text-[32px] font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-secondary-gray text-[16px]">
              <h2>{description}</h2>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomAddEditModal;
