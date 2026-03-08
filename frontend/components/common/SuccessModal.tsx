"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import successSvg from "@/public/images/modals/check.png";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showSecondaryButton?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onOpenChange,
  title = "Success",
  description = "Operation completed successfully!",
  primaryButtonText = "Continue",
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  showSecondaryButton = true,
}) => {
  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    onOpenChange(false);
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[30px] transition-all duration-300 shadow-xl max-w-md">
        <div
          className="absolute inset-0 m-3 rounded-[30px] -z-50"
          style={{
            background: `linear-gradient(to bottom, #F0FDF4, #FFFFFF, #FFFFFF)`,
            zIndex: -1,
          }}
        ></div>

        <div className="px-1 py-2 relative z-10">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-[24px] font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-secondary-gray text-[14px] text-center">
              {description}
            </DialogDescription>

            {/* Success Icon */}
            <div className="mt-6 mb-6">
              <Image
                src={successSvg}
                alt="success-icon"
                className="w-[240px] h-[240px] self-center"
              />
            </div>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            {showSecondaryButton && (
              <Button
                variant="outline"
                onClick={handleSecondaryAction}
                className="py-3 px-6 rounded-xl border text-gray-600"
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button
              onClick={handlePrimaryAction}
              className="rounded-xl py-3 px-6 bg-green-500 hover:bg-green-600 text-white"
            >
              {primaryButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
