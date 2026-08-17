import React, { useMemo } from "react";
import { MonthYearPicker } from "../ui/MonthYearPicker";
import {
  parseDateRange,
  formatDateRangeVi,
  formatDateRangeEn,
  formatMonthYearVi,
} from "../../utils/dateFormat";
import { Calendar, Check } from "lucide-react";

interface BilingualMonthYearPickerProps {
  labelVi?: string;
  labelEn?: string;
  valueVi: string;
  valueEn: string;
  onChangeVi: (v: string) => void;
  onChangeEn: (v: string) => void;
  required?: boolean;
  errorVi?: string;
  errorEn?: string;
  disabled?: boolean;
}

export const BilingualMonthYearPicker: React.FC<BilingualMonthYearPickerProps> = ({
  valueVi,
  valueEn,
  onChangeVi,
  onChangeEn,
  required = false,
  errorVi,
  errorEn,
  disabled = false,
}) => {
  // Derive range directly from props without redundant state & effects
  const range = useMemo(
    () => parseDateRange(valueVi, valueEn),
    [valueVi, valueEn],
  );

  const applyRange = (
    startMonth: number,
    startYear: number,
    endMonth: number,
    endYear: number,
    isPresent: boolean,
  ) => {
    const viStr = formatDateRangeVi(
      startMonth,
      startYear,
      endMonth,
      endYear,
      isPresent,
    );
    const enStr = formatDateRangeEn(
      startMonth,
      startYear,
      endMonth,
      endYear,
      isPresent,
    );

    onChangeVi(viStr);
    onChangeEn(enStr);
  };

  const handleStartChange = (_val: string, month: number, year: number) => {
    if (month > 0 && year > 0) {
      applyRange(month, year, range.endMonth, range.endYear, range.isPresent);
    }
  };

  const handleEndChange = (_val: string, month: number, year: number) => {
    if (month > 0 && year > 0) {
      applyRange(range.startMonth, range.startYear, month, year, false);
    }
  };

  const handleTogglePresent = () => {
    if (disabled) return;
    const nextPresent = !range.isPresent;
    applyRange(
      range.startMonth,
      range.startYear,
      range.endMonth,
      range.endYear,
      nextPresent,
    );
  };

  const startValueVi =
    range.startMonth && range.startYear
      ? formatMonthYearVi(range.startMonth, range.startYear)
      : "";
  const endValueVi =
    range.endMonth && range.endYear
      ? formatMonthYearVi(range.endMonth, range.endYear)
      : "";

  return (
    <div className="space-y-3 p-4 rounded-lg bg-surface/60 border border-border">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary flex items-center gap-1.5">
          <Calendar size={14} className="text-primary" />
          Thời gian thực hiện (Project Duration)
          {required && <span className="text-danger">*</span>}
        </label>

        {/* Checkbox 'Hiện tại / Present' */}
        <label
          onClick={handleTogglePresent}
          className={`flex items-center gap-2 text-xs font-medium cursor-pointer select-none px-2.5 py-1 rounded transition-colors ${
            range.isPresent
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-text-secondary hover:text-text-primary hover:bg-border/30 border border-transparent"
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
              range.isPresent
                ? "bg-primary border-primary text-white"
                : "border-border bg-surface"
            }`}
          >
            {range.isPresent && <Check size={12} strokeWidth={3} />}
          </div>
          <span>Đang thực hiện (Hiện tại / Present)</span>
        </label>
      </div>

      {/* Selectors grid: Start and End Month/Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <MonthYearPicker
          label="Bắt đầu (Start)"
          value={startValueVi}
          onChange={handleStartChange}
          lang="vi"
          required={required}
          disabled={disabled}
          id="project-start-time"
          placeholder="Chọn Tháng/Năm bắt đầu"
        />

        {range.isPresent ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Kết thúc (End)
            </span>
            <div className="w-full py-2 px-2.5 text-sm bg-primary/5 border-b-2 border-primary/40 text-primary font-medium rounded-t-sm flex items-center justify-between">
              <span>Hiện tại (Present)</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                Đang tiếp diễn
              </span>
            </div>
          </div>
        ) : (
          <MonthYearPicker
            label="Kết thúc (End)"
            value={endValueVi}
            onChange={handleEndChange}
            lang="vi"
            required={required}
            disabled={disabled}
            id="project-end-time"
            placeholder="Chọn Tháng/Năm kết thúc"
          />
        )}
      </div>

      {/* Bilingual Display Preview (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Thời gian (VI)
          </label>
          <input
            type="text"
            readOnly
            value={valueVi}
            placeholder="Tháng MM/YYYY - Tháng MM/YYYY"
            className={`w-full py-1.5 px-2 text-xs bg-transparent border-b border-border text-text-primary outline-none cursor-default select-text ${
              errorVi ? "border-danger text-danger" : ""
            }`}
          />
          {errorVi && <p className="text-xs text-danger mt-0.5">{errorVi}</p>}
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Completion time (EN)
          </label>
          <input
            type="text"
            readOnly
            value={valueEn}
            placeholder="MMM YYYY - MMM YYYY / Present"
            className={`w-full py-1.5 px-2 text-xs bg-transparent border-b border-border text-text-primary outline-none cursor-default select-text ${
              errorEn ? "border-danger text-danger" : ""
            }`}
          />
          {errorEn && <p className="text-xs text-danger mt-0.5">{errorEn}</p>}
        </div>
      </div>
    </div>
  );
};
