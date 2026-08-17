import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  VI_MONTHS,
  EN_MONTHS,
  parseMonthYear,
  formatMonthYearVi,
  formatMonthYearEn,
} from "../../utils/dateFormat";

export interface MonthYearPickerProps {
  label?: string;
  value: string;
  onChange: (value: string, month: number, year: number) => void;
  lang?: "vi" | "en";
  error?: string;
  required?: boolean;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  value,
  onChange,
  lang = "vi",
  error,
  required = false,
  id,
  placeholder,
  disabled = false,
  className = "",
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseMonthYear(value);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [viewYear, setViewYear] = useState<number>(
    parsed?.year ?? currentYear,
  );

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      // sync viewYear with current parsed value when opening
      if (parsed?.year) {
        setViewYear(parsed.year);
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectMonth = (month: number) => {
    const formatted =
      lang === "vi"
        ? formatMonthYearVi(month, viewYear)
        : formatMonthYearEn(month, viewYear);
    onChange(formatted, month, viewYear);
    setIsOpen(false);
  };

  const handleQuickCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear(currentYear);
    const formatted =
      lang === "vi"
        ? formatMonthYearVi(currentMonth, currentYear)
        : formatMonthYearEn(currentMonth, currentYear);
    onChange(formatted, currentMonth, currentYear);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", 0, 0);
  };

  const monthLabels = lang === "vi" ? VI_MONTHS : EN_MONTHS;

  return (
    <div className={`relative flex flex-col gap-1 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wide text-text-secondary cursor-pointer"
          onClick={handleToggle}
        >
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      {/* Input container */}
      <div
        className={`relative flex items-center w-full transition-all duration-150 rounded-t-sm ${
          disabled
            ? "bg-border/20 border-b border-border/40 text-text-muted cursor-not-allowed opacity-60"
            : "bg-surface/50 border-b-2 border-primary/30 text-text-primary hover:border-primary/60 hover:bg-surface/80 cursor-pointer"
        } ${isOpen ? "border-primary bg-surface" : ""} ${
          error ? "border-danger focus:border-danger" : ""
        }`}
        onClick={handleToggle}
      >
        <input
          id={inputId}
          readOnly
          value={value}
          placeholder={
            placeholder ||
            (lang === "vi" ? "Chọn Tháng/Năm" : "Select Month/Year")
          }
          className="w-full py-2 px-2.5 text-sm bg-transparent outline-none cursor-pointer placeholder:text-text-muted select-none"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
        />

        <div className="flex items-center gap-1 pr-2.5 text-text-secondary">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-text-primary transition-colors rounded-full hover:bg-border/30"
              title="Xóa"
            >
              <X size={13} />
            </button>
          )}
          <Calendar size={15} className="text-primary/70" />
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {/* Popover Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-72 p-3 bg-surface rounded-lg shadow-xl border border-border animate-in fade-in zoom-in-95 duration-100">
          {/* Year selector header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewYear((y) => y - 1);
              }}
              className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg rounded transition-colors"
              title="Năm trước"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm font-semibold text-text-primary">
              {viewYear}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewYear((y) => y + 1);
              }}
              className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg rounded transition-colors"
              title="Năm sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {monthLabels.map((mName, index) => {
              const monthNum = index + 1;
              const isSelected =
                parsed?.month === monthNum && parsed?.year === viewYear;
              const isCurrent =
                currentMonth === monthNum && currentYear === viewYear;

              return (
                <button
                  key={monthNum}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMonth(monthNum);
                  }}
                  className={`py-1.5 px-2 text-xs font-medium rounded transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-sm font-semibold"
                      : isCurrent
                      ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg"
                  }`}
                >
                  {mName}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
            <button
              type="button"
              onClick={handleQuickCurrent}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              {lang === "vi" ? "Tháng hiện tại" : "Current month"}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              {lang === "vi" ? "Đóng" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
