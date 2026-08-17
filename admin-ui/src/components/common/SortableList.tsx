import React from "react";
import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";

interface SortableListProps<T extends { id: number }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  renderItem,
  className = "",
}: SortableListProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={["space-y-2", className].join(" ")}
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="cursor-grab active:cursor-grabbing"
          layout
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-start gap-2">
            <div className="mt-3 shrink-0 text-text-muted">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 min-w-0">{renderItem(item)}</div>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
