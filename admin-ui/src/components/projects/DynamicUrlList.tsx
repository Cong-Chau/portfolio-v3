import React from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Link2,
  Globe,
  GitBranch,
  FileText,
  Palette,
  Code2,
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { ProjectUrl } from "../../types/api";

const URL_RE = /^https?:\/\/.+/;

interface DynamicUrlListProps {
  urls: ProjectUrl[];
  onChange: (urls: ProjectUrl[]) => void;
  errors?: Array<Partial<Record<keyof ProjectUrl, string>>>;
}

interface UrlRow extends ProjectUrl {
  _key: string;
}

const PRESETS = [
  {
    icon: "💻",
    name: "GitHub",
    labelVi: "Mã nguồn",
    labelEn: "Source Code",
    placeholder: "https://github.com/...",
  },
  {
    icon: "🚀",
    name: "Live Demo",
    labelVi: "Trực tiếp",
    labelEn: "Live Demo",
    placeholder: "https://...",
  },
  {
    icon: "📄",
    name: "Tài liệu",
    labelVi: "Tài liệu",
    labelEn: "Documentation",
    placeholder: "https://docs...",
  },
  {
    icon: "🎨",
    name: "Figma",
    labelVi: "Bản thiết kế",
    labelEn: "Figma Design",
    placeholder: "https://figma.com/...",
  },
];

function getLinkIcon(url: string, label: string) {
  const lowerUrl = url.toLowerCase();
  const lowerLabel = label.toLowerCase();

  if (lowerUrl.includes("github.com") || lowerLabel.includes("github") || lowerLabel.includes("mã nguồn") || lowerLabel.includes("source")) {
    return <GitBranch size={14} className="text-text-primary" />;
  }
  if (lowerUrl.includes("figma.com") || lowerLabel.includes("figma") || lowerLabel.includes("thiết kế")) {
    return <Palette size={14} className="text-purple-400" />;
  }
  if (lowerLabel.includes("doc") || lowerLabel.includes("tài liệu") || lowerUrl.includes("readme") || lowerUrl.includes("gitbook")) {
    return <FileText size={14} className="text-amber-400" />;
  }
  if (lowerLabel.includes("api") || lowerUrl.includes("swagger") || lowerUrl.includes("postman")) {
    return <Code2 size={14} className="text-emerald-400" />;
  }
  return <Globe size={14} className="text-accent" />;
}

export const DynamicUrlList: React.FC<DynamicUrlListProps> = ({
  urls,
  onChange,
  errors = [],
}) => {
  const rows: UrlRow[] = urls.map((u, i) => ({ ...u, _key: `url-${i}-${u.url || ""}` }));

  const updateRow = (index: number, field: keyof ProjectUrl, value: string) => {
    const updated = urls.map((u, i) => {
      if (i !== index) return u;
      const next = { ...u, [field]: value };

      // Auto-suggest labels when pasting known URLs if labels are empty
      if (field === "url" && value && !u.labelVi && !u.labelEn) {
        const lower = value.toLowerCase();
        if (lower.includes("github.com")) {
          next.labelVi = "Mã nguồn";
          next.labelEn = "Source Code";
        } else if (lower.includes("figma.com")) {
          next.labelVi = "Bản thiết kế";
          next.labelEn = "Figma Design";
        } else if (lower.includes("docs.") || lower.includes("/docs") || lower.includes("gitbook")) {
          next.labelVi = "Tài liệu";
          next.labelEn = "Documentation";
        }
      }

      return next;
    });
    onChange(updated);
  };

  const addRow = () => {
    onChange([...urls, { labelVi: "", labelEn: "", url: "" }]);
  };

  const addPreset = (labelVi: string, labelEn: string, placeholderUrl = "") => {
    onChange([...urls, { labelVi, labelEn, url: placeholderUrl }]);
  };

  const removeRow = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const handleReorder = (reordered: UrlRow[]) => {
    onChange(reordered.map(({ labelVi, labelEn, url }) => ({ labelVi, labelEn, url })));
  };

  return (
    <div className="space-y-4">
      {urls.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-border/80 bg-bg/30 text-center space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-text-muted shadow-2xs">
            <Link2 size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">Chưa có liên kết dự án</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Thêm liên kết GitHub, Live Demo, Docs hoặc Figma
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => addPreset(p.labelVi, p.labelEn)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-surface hover:border-accent/60 text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-xs"
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={addRow}
              type="button"
              id="add-first-url-btn"
            >
              Thêm
            </Button>
          </div>
        </div>
      ) : (
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
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="group relative rounded-xl border border-border/80 bg-bg/50 hover:bg-surface/90 hover:border-border transition-all p-3.5 space-y-3 shadow-xs">
                    {/* Item Header */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary transition-colors p-0.5 rounded hover:bg-border/40"
                          title="Kéo thả để sắp xếp thứ tự"
                        >
                          <GripVertical size={14} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                          <span className="flex items-center justify-center h-5 w-5 rounded bg-surface border border-border/60">
                            {getLinkIcon(row.url, row.labelEn || row.labelVi)}
                          </span>
                          <span>Liên kết #{i + 1}</span>
                          {row.labelVi && (
                            <span className="text-[11px] font-normal text-text-muted truncate max-w-32">
                              • {row.labelVi}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {row.url && URL_RE.test(row.url) && (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-accent hover:bg-accent/10 transition-colors"
                            title="Mở liên kết trong tab mới"
                          >
                            <ExternalLink size={12} />
                            <span>Mở link</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="p-1 text-text-muted hover:text-red-400 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Gỡ bỏ liên kết này"
                          id={`remove-url-${i}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <Input
                        label="Đường dẫn URL"
                        value={row.url}
                        onChange={(e) => updateRow(i, "url", e.target.value)}
                        error={errors[i]?.url}
                        placeholder="https://github.com/... hoặc https://..."
                        required
                        id={`url-value-${i}`}
                      />
                    </div>

                    {/* Bilingual Labels (VI & EN) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Nhãn hiển thị (VI)"
                        value={row.labelVi}
                        onChange={(e) => updateRow(i, "labelVi", e.target.value)}
                        error={errors[i]?.labelVi}
                        maxLength={50}
                        placeholder="VD: Mã nguồn, Live Demo..."
                        required
                        id={`url-label-vi-${i}`}
                      />
                      <Input
                        label="Display Label (EN)"
                        value={row.labelEn}
                        onChange={(e) => updateRow(i, "labelEn", e.target.value)}
                        error={errors[i]?.labelEn}
                        maxLength={50}
                        placeholder="e.g. Source Code, Demo..."
                        required
                        id={`url-label-en-${i}`}
                      />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Quick presets footer & Add button */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Thêm nhanh theo mẫu:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => addPreset(p.labelVi, p.labelEn)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border/70 bg-bg/50 hover:bg-surface hover:border-accent/50 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-2xs"
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                icon={<Plus size={13} />}
                onClick={addRow}
                type="button"
                className="text-xs ml-auto"
                id="add-url-btn"
              >
                Thêm link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
