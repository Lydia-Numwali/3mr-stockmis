import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";

type Enable2FAModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeDataUrl: string;
  secret: string;
  onClose: () => void;
};

export const Enable2FAModal = ({
  open,
  onOpenChange,
  qrCodeDataUrl,
  secret,
  onClose,
}: Enable2FAModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="solar:shield-check-linear" className="h-5 w-5" />
            Setup Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with your authenticator app:
          </p>

          <div className="flex justify-center">
            <img
              src={qrCodeDataUrl}
              alt="2FA QR Code"
              className="h-48 w-48 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Or enter this secret key manually:
            </p>
            <div className="p-3 bg-muted rounded-md text-sm font-mono break-all">
              {secret}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>I've set up my authenticator</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
