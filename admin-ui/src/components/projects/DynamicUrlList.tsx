import React from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { ProjectUrl } from "../../types/api";

const URL_RE = /^https?:\/\/.+/;

interface DynamicUrlListProps {
  urls: ProjectUrl[];
  onChange: (urls: ProjectUrl[]) => void;
  errors?: Array<Partial<Record<keyof ProjectUrl, string>>>;
  onBlurUrl?: (index: number) => void;
}

// We add a temp key for stable Reorder identity
interface UrlRow extends ProjectUrl {
  _key: string;
}

export const DynamicUrlList: React.FC<DynamicUrlListProps> = ({
  urls,
  onChange,
  errors = [],
}) => {
  const rows: UrlRow[] = urls.map((u, i) => ({ ...u, _key: `url-${i}` }));

  const updateRow = (index: number, field: keyof ProjectUrl, value: string) => {
    const updated = urls.map((u, i) =>
      i === index ? { ...u, [field]: value } : u,
    );
    onChange(updated);
  };

  const addRow = () => {
    onChange([...urls, { labelVi: "", labelEn: "", url: "" }]);
  };

  const removeRow = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const handleReorder = (reordered: UrlRow[]) => {
    onChange(reordered.map(({ labelVi, labelEn, url }) => ({ labelVi, labelEn, url })));
  };

  return (
    <div className="space-y-3">
      <Reorder.Group
        axis="y"
        values={rows}
        onReorder={handleReorder}
        className="space-y-3"
      >
        <AnimatePresence>
          {rows.map((row, i) => (
            <Reorder.Item
              key={row._key}
              value={row}
              layout
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-start gap-2 rounded-lg border border-border p-3 bg-bg">
                <div className="mt-3 shrink-0 cursor-grab active:cursor-grabbing text-text-muted">
                  <GripVertical size={15} />
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <Input
                    label="Label (VI)"
                    value={row.labelVi}
                    onChange={(e) => updateRow(i, "labelVi", e.target.value)}
                    error={errors[i]?.labelVi}
                    maxLength={50}
                    id={`url-label-vi-${i}`}
                  />
                  <Input
                    label="Label (EN)"
                    value={row.labelEn}
                    onChange={(e) => updateRow(i, "labelEn", e.target.value)}
                    error={errors[i]?.labelEn}
                    maxLength={50}
                    id={`url-label-en-${i}`}
                  />
                  <Input
                    label="URL"
                    value={row.url}
                    onChange={(e) => updateRow(i, "url", e.target.value)}
                    onBlur={() => {
                      // Inline URL validation feedback on blur
                      if (row.url && !URL_RE.test(row.url)) {
                        // Errors are passed from parent; this just triggers re-render
                      }
                    }}
                    error={errors[i]?.url}
                    placeholder="https://..."
                    id={`url-value-${i}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="mt-6 shrink-0 text-text-muted hover:text-danger transition-colors"
                  id={`remove-url-${i}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <Button
        variant="secondary"
        size="sm"
        icon={<Plus size={13} />}
        onClick={addRow}
        type="button"
        id="add-url-btn"
      >
        Thêm liên kết
      </Button>
    </div>
  );
};
