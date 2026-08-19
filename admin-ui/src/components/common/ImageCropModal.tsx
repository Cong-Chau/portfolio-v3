import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Crop } from "lucide-react";
import { Button } from "../ui/Button";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onConfirm: (croppedFile: File) => void;
  title?: string;
  outputSize?: number;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  fileName = "avatar.jpg",
  onClose,
  onConfirm,
  title = "Cắt ảnh đại diện vuông",
  outputSize = 800,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [baseDimensions, setBaseDimensions] = useState<{ width: number; height: number }>({
    width: 288,
    height: 288,
  });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Helper to clamp offset to avoid showing empty gaps outside crop viewport
  const clampOffset = useCallback(
    (newOffset: { x: number; y: number }, currentZoom: number) => {
      const container = containerRef.current;
      const img = imageRef.current;
      if (!container || !img) return newOffset;

      const cropSize = container.offsetWidth || 288;
      const nw = img.naturalWidth || cropSize;
      const nh = img.naturalHeight || cropSize;

      const baseScale = Math.max(cropSize / nw, cropSize / nh);
      const curW = nw * baseScale * currentZoom;
      const curH = nh * baseScale * currentZoom;

      const maxOffsetX = Math.max(0, (curW - cropSize) / 2);
      const maxOffsetY = Math.max(0, (curH - cropSize) / 2);

      return {
        x: Math.min(Math.max(newOffset.x, -maxOffsetX), maxOffsetX),
        y: Math.min(Math.max(newOffset.y, -maxOffsetY), maxOffsetY),
      };
    },
    []
  );

  // Reset state when new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Update zoom with offset boundary re-clamping
  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, 1), 3);
    setZoom(clampedZoom);
    setOffset((prev) => clampOffset(prev, clampedZoom));
  };

  // Image load handler to calculate initial base cover dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const cropSize = containerRef.current?.offsetWidth || 288;

    const baseScale = Math.max(cropSize / nw, cropSize / nh);
    setBaseDimensions({
      width: nw * baseScale,
      height: nh * baseScale,
    });
    setOffset({ x: 0, y: 0 });
  };

  // Mouse Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const rawOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setOffset(clampOffset(rawOffset, zoom));
    },
    [isDragging, dragStart, zoom, clampOffset]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const rawOffset = {
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    };
    setOffset(clampOffset(rawOffset, zoom));
  };

  // Zoom via wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    handleZoomChange(zoom + delta);
  };

  // Reset adjustments
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Perform canvas crop and return File
  const handleCropConfirm = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const cropSize = container.offsetWidth || 288;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const baseScale = Math.max(cropSize / nw, cropSize / nh);
    const curW = nw * baseScale * zoom;
    const curH = nh * baseScale * zoom;

    // Strict clamped offset to avoid borders
    const finalOffset = clampOffset(offset, zoom);

    // Top-left coordinate of image relative to container top-left
    const imgLeft = (cropSize - curW) / 2 + finalOffset.x;
    const imgTop = (cropSize - curH) / 2 + finalOffset.y;

    // Transform container viewport to original source coordinates
    const totalScale = baseScale * zoom;
    const sx = Math.max(0, -imgLeft / totalScale);
    const sy = Math.max(0, -imgTop / totalScale);
    const sWidth = Math.min(nw - sx, cropSize / totalScale);
    const sHeight = Math.min(nh - sy, cropSize / totalScale);

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, outputSize, outputSize);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File(
          [blob],
          fileName.replace(/\.[^/.]+$/, "") + "_square.jpg",
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );
        onConfirm(croppedFile);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="crop-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            key="crop-modal"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md my-auto flex flex-col bg-surface rounded-xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0 bg-surface">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg border border-border text-primary shrink-0">
                  <Crop size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-text-primary truncate">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-border/40 hover:text-text-primary shrink-0 cursor-pointer"
                title="Đóng"
              >
                <X size={16} />
              </button>
            </div>

            {/* Crop Body */}
            <div className="p-5 flex flex-col items-center bg-surface">
              <p className="text-xs text-text-muted mb-4 text-center leading-relaxed">
                Kéo ảnh để căn chỉnh vị trí khuôn mặt và dùng thanh trượt để phóng to/thu nhỏ
              </p>

              {/* Crop Viewport */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onWheel={handleWheel}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-xl overflow-hidden bg-[#151514] border-2 border-primary/30 shadow-inner cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
              >
                {/* Image Layer with clamped translation and scale */}
                <div
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    width: `${baseDimensions.width}px`,
                    height: `${baseDimensions.height}px`,
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.08s ease-out",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop preview"
                    onLoad={handleImageLoad}
                    className="w-full h-full object-cover max-w-none pointer-events-none"
                    draggable={false}
                  />
                </div>

                {/* Circular mask guide overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-dashed border-white/90 shadow-[0_0_0_9999px_rgba(27,42,74,0.6)]" />

                {/* Crosshair guidelines */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-px bg-white/20" />
                  <div className="h-full w-px bg-white/20 absolute" />
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="w-full mt-5 px-1 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleZoomChange(zoom - 0.2)}
                  className="p-2 rounded-lg border border-border bg-bg text-text-secondary hover:text-text-primary hover:bg-border/40 transition cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut size={15} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="flex-1 accent-primary h-1.5 bg-border rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => handleZoomChange(zoom + 0.2)}
                  className="p-2 rounded-lg border border-border bg-bg text-text-secondary hover:text-text-primary hover:bg-border/40 transition cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-lg border border-border bg-bg text-text-secondary hover:text-text-primary hover:bg-border/40 transition cursor-pointer"
                  title="Đặt lại vị trí ban đầu"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 bg-bg/50 border-t border-border">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                icon={<X size={15} />}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleCropConfirm}
                icon={<Check size={15} />}
              >
                Xác nhận & Tải lên
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
