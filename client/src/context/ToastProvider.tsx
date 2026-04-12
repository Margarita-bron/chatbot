// src/context/ToastProvider.tsx
import { useState, useCallback, type ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { ToastContext, type Toast, type ToastType } from "./ToastContext";
import { ToastContainer } from "../components/ToastContainer";

type Props = { children: ReactNode };

export function ToastProvider({ children }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: { title: string; description: string | null },
      type: ToastType = "info",
    ) => {
      const id = uuid();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
