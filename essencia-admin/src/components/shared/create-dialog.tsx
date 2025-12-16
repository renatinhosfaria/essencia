import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import React from "react";

interface CreateDialogProps {
  triggerText: string;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
  triggerButton?: React.ReactNode;
  disabled?: boolean;
}

export function CreateDialog({
  triggerText,
  title,
  description,
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  isConfirming = false,
  confirmText = "Criar",
  cancelText = "Cancelar",
  children,
  triggerButton,
  disabled = false,
}: CreateDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
            <Plus className="mr-2 h-4 w-4" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black"
            onClick={onConfirm}
            disabled={disabled || isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmText}...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
