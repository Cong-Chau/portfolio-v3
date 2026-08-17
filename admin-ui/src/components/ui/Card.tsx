import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => (
  <div
    className={[
      "bg-surface border border-border rounded-lg",
      paddingClasses[padding],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      {subtitle && (
        <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);
