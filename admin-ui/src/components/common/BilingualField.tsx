import React from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

type FieldType = "input" | "textarea";

interface BilingualFieldProps {
  labelVi: string;
  labelEn: string;
  valueVi: string;
  valueEn: string;
  onChangeVi: (v: string) => void;
  onChangeEn: (v: string) => void;
  type?: FieldType;
  required?: boolean;
  errorVi?: string;
  errorEn?: string;
  rows?: number;
  placeholder?: string;
  placeholderVi?: string;
  placeholderEn?: string;
  disabled?: boolean;
  readOnly?: boolean;
  layout?: "grid" | "stack";
}

export const BilingualField: React.FC<BilingualFieldProps> = ({
  labelVi,
  labelEn,
  valueVi,
  valueEn,
  onChangeVi,
  onChangeEn,
  type = "input",
  required = false,
  errorVi,
  errorEn,
  rows = 4,
  placeholder,
  placeholderVi,
  placeholderEn,
  disabled,
  readOnly,
  layout,
}) => {
  const FieldComponent = type === "textarea" ? Textarea : Input;
  const isGrid =
    layout === "grid" || (layout !== "stack" && type === "input");

  return (
    <div
      className={
        isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
      }
    >
      <FieldComponent
        label={labelVi}
        value={valueVi}
        onChange={(e) => onChangeVi(e.target.value)}
        required={required}
        error={errorVi}
        rows={rows}
        placeholder={placeholderVi || placeholder}
        disabled={disabled}
        readOnly={readOnly}
      />
      <FieldComponent
        label={labelEn}
        value={valueEn}
        onChange={(e) => onChangeEn(e.target.value)}
        required={required}
        error={errorEn}
        rows={rows}
        placeholder={placeholderEn || placeholder}
        disabled={disabled}
        readOnly={readOnly}
      />
    </div>
  );
};

