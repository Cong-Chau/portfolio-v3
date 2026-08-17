import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-5xl",
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={[
              "relative z-10 w-full my-auto flex flex-col bg-surface rounded-xl shadow-2xl border border-border overflow-hidden max-h-[calc(100dvh-2rem)]",
              maxWidthClasses[maxWidth],
            ].join(" ")}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4 shrink-0 bg-surface">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary truncate pr-2">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-border/40 hover:text-text-primary shrink-0"
                  id="modal-close-btn"
                  aria-label="Đóng"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="px-4 py-4 sm:px-6 sm:py-5 overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
