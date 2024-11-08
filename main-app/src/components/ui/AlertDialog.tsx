// components/ui/AlertDialog.tsx
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import React from 'react';

// Wrapper for the entire AlertDialog component
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = AlertDialogPrimitive.Content;
export const AlertDialogOverlay = AlertDialogPrimitive.Overlay;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-4 mt-4">{children}</div>
);

// Main component for AlertDialog structure
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function CustomAlertDialog({ open, onOpenChange, onConfirm, onCancel }: AlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogOverlay className="fixed inset-0 bg-black bg-opacity-30" />
      <AlertDialogContent className="fixed inset-0 flex items-center justify-center p-4 bg-white rounded shadow-md max-w-md mx-auto">
        <AlertDialogTitle className="text-lg font-semibold">Confirm Action</AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm text-gray-600">
          Are you sure you want to proceed? This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded">
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-blue-600 rounded">
              Confirm
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
