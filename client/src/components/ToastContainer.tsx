import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "../context/ToastContext";

const variants = {
  success: "bg-green-50 border-green-300 text-green-900",
  error: "bg-red-50 border-red-300 text-red-900",
  warning: "bg-yellow-50 border-yellow-300 text-yellow-900",
  info: "bg-blue-50 border-blue-300 text-blue-900",
};

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <AlertTriangle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none z-50 space-y-3">
      {toasts
        .slice(-2)
        .reverse()
        .map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg p-4 flex items-start gap-3 transform transition-all toast-enter ${variants[toast.type]}`}
          >
            <div className="flex-shrink-0 self-center-safe">
              {icons[toast.type]}
            </div>

            <div className="flex flex-col items-start ml-3">
              <div className="flex-1 text-sm font-medium">
                {toast.message.title}
              </div>
              <div className="flex-1 text-xs font-light text-left">
                {toast.message.description}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
    </div>
  );
}
