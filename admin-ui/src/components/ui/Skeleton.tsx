import React from "react";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  lines = 1,
}) => {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={[
              "animate-pulse rounded bg-border/60",
              i === lines - 1 ? "w-3/4" : "w-full",
              "h-4",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={["animate-pulse rounded bg-border/60", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
    <Skeleton className="h-5 w-40" />
    <Skeleton lines={3} />
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 4 }) => (
  <tr className="border-b border-border">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);
