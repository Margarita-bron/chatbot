import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
export type Toast = {
  id: string;
  type: ToastType;
  message: { title: string; description: string | null };
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (
    message: { title: string; description: string | null },
    type?: ToastType,
  ) => void;
  removeToast: (id: string) => void;
};
export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
