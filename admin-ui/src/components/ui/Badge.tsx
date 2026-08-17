import React from "react";

type BadgeVariant = "default" | "accent" | "success" | "danger" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-border text-text-secondary",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  muted: "bg-border/60 text-text-muted",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </span>
);
