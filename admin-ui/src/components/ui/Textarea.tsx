import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = "", ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const stateClass = rest.disabled
      ? "bg-border/20 border-b border-border/40 text-text-muted cursor-not-allowed opacity-60"
      : rest.readOnly
      ? "bg-transparent border-b border-dashed border-border/70 text-text-primary cursor-default select-text"
      : "bg-surface/50 border-b-2 border-primary/30 text-text-primary placeholder:text-text-muted hover:border-primary/60 hover:bg-surface/80 focus:border-primary focus:bg-surface rounded-t-sm px-2.5";

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
          >
            {label}
            {rest.required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            "w-full resize-y py-2 text-sm transition-all duration-150 outline-none",
            stateClass,
            error ? "border-danger focus:border-danger" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
