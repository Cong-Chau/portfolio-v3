import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import type { ToastType } from "../../types/api";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-success shrink-0" />,
  error: <XCircle size={16} className="text-danger shrink-0" />,
  info: <Info size={16} className="text-primary shrink-0" />,
};

const bgMap: Record<ToastType, string> = {
  success: "border-success/20 bg-success/5",
  error: "border-danger/20 bg-danger/5",
  info: "border-primary/20 bg-primary/5",
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2" id="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={[
              "flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg bg-surface",
              bgMap[toast.type],
            ].join(" ")}
          >
            {iconMap[toast.type]}
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
