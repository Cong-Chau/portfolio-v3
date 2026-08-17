import React, { useState } from "react";
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
  disabled?: boolean;
  readOnly?: boolean;
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
  rows,
  placeholder,
  disabled,
  readOnly,
}) => {
  const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");

  const tabs: Array<{ key: "vi" | "en"; label: string }> = [
    { key: "vi", label: "🇻🇳 VI" },
    { key: "en", label: "🇬🇧 EN" },
  ];

  const FieldComponent = type === "textarea" ? Textarea : Input;

  return (
    <div className="flex flex-col gap-2">
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              "px-3 py-1.5 text-xs font-semibold transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active field */}
      {activeTab === "vi" ? (
        <FieldComponent
          label={labelVi}
          value={valueVi}
          onChange={(e) => onChangeVi(e.target.value)}
          required={required}
          error={errorVi}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : (
        <FieldComponent
          label={labelEn}
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
          required={required}
          error={errorEn}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
    </div>
  );
};
