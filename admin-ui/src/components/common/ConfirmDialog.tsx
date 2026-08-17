import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Hành động này không thể hoàn tác.",
  confirmLabel = "Xóa",
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} maxWidth="sm">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle size={22} className="text-danger" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      <div className="flex w-full gap-3 pt-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={loading}
          id="confirm-cancel-btn"
        >
          Hủy
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={onConfirm}
          loading={loading}
          id="confirm-ok-btn"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
