"use client";

import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  type DialogPopupProps,
} from '@/components/animate-ui/components/base/dialog';


interface ManualTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ onOpenChange, open }: ManualTriggerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle> Mannual Trigger </DialogTitle>
          <DialogDescription> Configure settings for the mannual trigger node. </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-muted-foreground'> Mannual trigger</p>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

