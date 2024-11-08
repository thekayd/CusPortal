// components/ui/useToast.tsx
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

export const useToast = () => {
  const showToast = (message: string, options?: ToastOptions) => {
    toast(message, options);
  };

  return { showToast };
};

export const ToastProvider: React.FC = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    closeOnClick
  />
);
