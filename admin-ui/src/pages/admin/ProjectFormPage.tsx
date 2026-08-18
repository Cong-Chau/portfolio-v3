import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useSkills } from "../../hooks/useSkills";
import { useToast } from "../../context/ToastContext";
import { translationService } from "../../services/translationService";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { BilingualMonthYearPicker } from "../../components/common/BilingualMonthYearPicker";
import { SkillTagPicker } from "../../components/projects/SkillTagPicker";
import { DynamicUrlList } from "../../components/projects/DynamicUrlList";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { ProjectRequest, ProjectUrl, SkillResponse } from "../../types/api";
import { Save, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const URL_RE = /^https?:\/\/.+/;

type Errors = Partial<{
  titleVi: string;
  titleEn: string;
  completeTimeVi: string;
  completeTimeEn: string;
  descriptionVi: string;
  descriptionEn: string;
  highlightVi: string;
  highlightEn: string;
  orderIndex: string;
  urls: Array<Partial<Record<keyof ProjectUrl, string>>>;
}>;

function validate(form: ProjectRequest): Errors {
  const e: Errors = {};
  if (!form.titleVi.trim()) e.titleVi = "Bắt buộc";
  if (!form.titleEn.trim()) e.titleEn = "Bắt buộc";
  if (!form.completeTimeVi.trim()) e.completeTimeVi = "Bắt buộc";
  if (!form.completeTimeEn.trim()) e.completeTimeEn = "Bắt buộc";
  if (!form.descriptionVi.trim()) e.descriptionVi = "Bắt buộc";
  if (!form.descriptionEn.trim()) e.descriptionEn = "Bắt buộc";
  if (!form.highlightVi.trim()) e.highlightVi = "Bắt buộc";
  if (!form.highlightEn.trim()) e.highlightEn = "Bắt buộc";
  if (form.orderIndex < 0) e.orderIndex = "Phải >= 0";

  const urlErrors = form.urls.map((u) => {
    const ue: Partial<Record<keyof ProjectUrl, string>> = {};
    if (!u.labelVi.trim()) ue.labelVi = "Bắt buộc";
    if (!u.labelEn.trim()) ue.labelEn = "Bắt buộc";
    if (!u.url.trim()) ue.url = "Bắt buộc";
    else if (!URL_RE.test(u.url)) ue.url = "URL không hợp lệ";
    return ue;
  });

  if (urlErrors.some((ue) => Object.keys(ue).length > 0)) {
    e.urls = urlErrors;
  }

  return e;
}

const EMPTY: ProjectRequest = {
  titleVi: "",
  titleEn: "",
  completeTimeVi: "",
  completeTimeEn: "",
  descriptionVi: "",
  descriptionEn: "",
  highlightVi: "",
  highlightEn: "",
  orderIndex: 0,
  isVisible: true,
  skillIds: [],
  urls: [],
};

interface ProjectFormProps {
  initialForm: ProjectRequest;
  isEdit: boolean;
  allSkills: SkillResponse[];
  saving: boolean;
  onSubmit: (form: ProjectRequest) => Promise<boolean>;
}

function ProjectForm({
  initialForm,
  isEdit,
  allSkills,
  saving,
  onSubmit,
}: ProjectFormProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState<ProjectRequest>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [translatingKey, setTranslatingKey] = useState<string | null>(null);
  const [translatingAll, setTranslatingAll] = useState<"vi2en" | "en2vi" | null>(null);

  const set = <K extends keyof ProjectRequest>(
    key: K,
    value: ProjectRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTranslateField = async (
    sourceKey: "titleVi" | "titleEn" | "descriptionVi" | "descriptionEn" | "highlightVi" | "highlightEn",
    targetKey: "titleVi" | "titleEn" | "descriptionVi" | "descriptionEn" | "highlightVi" | "highlightEn",
    sourceLang: "vi" | "en",
    targetLang: "vi" | "en",
    context: string,
  ) => {
    const text = form[sourceKey]?.trim();
    if (!text) {
      addToast("Vui lòng nhập nội dung trước khi dịch", "error");
      return;
    }

    setTranslatingKey(sourceKey);
    try {
      const res = await translationService.translate({
        text,
        sourceLang,
        targetLang,
        context,
      });

      if (res.translatedText) {
        set(targetKey, res.translatedText);
        addToast(
          `Dịch sang ${targetLang === "en" ? "Tiếng Anh" : "Tiếng Việt"} thành công!`,
          "success",
        );
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Dịch tự động thất bại. Vui lòng thử lại.";
      addToast(errorMsg, "error");
    } finally {
      setTranslatingKey(null);
    }
  };

  const handleTranslateAll = async (direction: "vi2en" | "en2vi") => {
    const isViToEn = direction === "vi2en";
    const sourceLang = isViToEn ? "vi" : "en";
    const targetLang = isViToEn ? "en" : "vi";

    const fieldsToTranslate = isViToEn
      ? [
          {
            sourceKey: "titleVi" as const,
            targetKey: "titleEn" as const,
            text: form.titleVi?.trim(),
            context: "Project title for software developer / engineer portfolio",
          },
          {
            sourceKey: "descriptionVi" as const,
            targetKey: "descriptionEn" as const,
            text: form.descriptionVi?.trim(),
            context: "Detailed project description for software portfolio",
          },
          {
            sourceKey: "highlightVi" as const,
            targetKey: "highlightEn" as const,
            text: form.highlightVi?.trim(),
            context: "Key features, achievements and technical highlights of a software project",
          },
        ]
      : [
          {
            sourceKey: "titleEn" as const,
            targetKey: "titleVi" as const,
            text: form.titleEn?.trim(),
            context: "Tên dự án công nghệ / phần mềm",
          },
          {
            sourceKey: "descriptionEn" as const,
            targetKey: "descriptionVi" as const,
            text: form.descriptionEn?.trim(),
            context: "Mô tả chi tiết dự án công nghệ / phần mềm",
          },
          {
            sourceKey: "highlightEn" as const,
            targetKey: "highlightVi" as const,
            text: form.highlightEn?.trim(),
            context: "Điểm nổi bật, tính năng chính và thành tựu kỹ thuật của dự án",
          },
        ];

    const activeFields = fieldsToTranslate.filter((f) => !!f.text);
    if (activeFields.length === 0) {
      addToast(
        `Vui lòng nhập ít nhất một trường ${isViToEn ? "Tiếng Việt" : "Tiếng Anh"} để dịch`,
        "error",
      );
      return;
    }

    setTranslatingAll(direction);
    try {
      const results = await Promise.all(
        activeFields.map(async (field) => {
          const res = await translationService.translate({
            text: field.text!,
            sourceLang,
            targetLang,
            context: field.context,
          });
          return { targetKey: field.targetKey, text: res.translatedText };
        }),
      );

      setForm((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (r.text) {
            next[r.targetKey] = r.text;
          }
        });
        return next;
      });

      setErrors((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          next[r.targetKey] = undefined;
        });
        return next;
      });

      addToast(
        `Đã tự động dịch tất cả sang ${isViToEn ? "Tiếng Anh" : "Tiếng Việt"}!`,
        "success",
      );
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Dịch tự động thất bại. Vui lòng thử lại.";
      addToast(errorMsg, "error");
    } finally {
      setTranslatingAll(null);
    }
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    await onSubmit(form);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={() => navigate("/admin/projects")}
          id="back-btn"
        >
          Quay lại
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            {isEdit ? "Sửa dự án" : "Tạo dự án mới"}
          </h1>
          <p className="text-xs text-text-muted">
            {isEdit
              ? "Cập nhật nội dung song ngữ và thông tin chi tiết dự án"
              : "Điền đầy đủ thông tin để thêm dự án mới vào danh mục"}
          </p>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left column: bilingual content & duration & order */}
        <div className="space-y-6 min-w-0">
          {/* Bilingual Content Card */}
          <Card>
            <CardHeader
              title="Thông tin song ngữ"
              subtitle="Tên dự án, mô tả và điểm nổi bật bằng Tiếng Việt & Tiếng Anh"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột Tiếng Việt */}
              <div className="space-y-5 rounded-xl border border-border/80 bg-bg/40 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none">🇻🇳</span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                        Nội dung Tiếng Việt
                      </h3>
                      <p className="text-[11px] text-text-muted truncate">
                        Hiển thị trên giao diện phiên bản Tiếng Việt
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={translatingAll === "vi2en"}
                    disabled={
                      translatingAll !== null ||
                      translatingKey !== null ||
                      (!form.titleVi?.trim() &&
                        !form.descriptionVi?.trim() &&
                        !form.highlightVi?.trim())
                    }
                    icon={<Sparkles size={14} className="text-accent" />}
                    onClick={() => handleTranslateAll("vi2en")}
                    title="Tự động dịch tất cả các mục từ Tiếng Việt sang Tiếng Anh"
                    id="btn-translate-all-vi-to-en"
                    className="shrink-0 text-xs"
                  >
                    Dịch VI ➔ EN
                  </Button>
                </div>

                {/* Title VI */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-title-vi"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Tên dự án (VI) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "titleVi",
                          "titleEn",
                          "vi",
                          "en",
                          "Project title for software developer / engineer portfolio",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.titleVi?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch tên dự án sang Tiếng Anh"
                      id="btn-translate-title-vi"
                    >
                      {translatingKey === "titleVi" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang EN
                    </button>
                  </div>
                  <Input
                    value={form.titleVi}
                    onChange={(e) => set("titleVi", e.target.value)}
                    required
                    error={errors.titleVi}
                    placeholder="VD: Nền tảng thương mại điện tử..."
                    id="input-title-vi"
                  />
                </div>

                {/* Description VI */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-description-vi"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Mô tả dự án (VI) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "descriptionVi",
                          "descriptionEn",
                          "vi",
                          "en",
                          "Detailed project description for a software engineer portfolio",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.descriptionVi?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch mô tả dự án sang Tiếng Anh"
                      id="btn-translate-desc-vi"
                    >
                      {translatingKey === "descriptionVi" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang EN
                    </button>
                  </div>
                  <Textarea
                    value={form.descriptionVi}
                    onChange={(e) => set("descriptionVi", e.target.value)}
                    required
                    error={errors.descriptionVi}
                    rows={5}
                    placeholder="Mô tả tổng quan về dự án, bài toán giải quyết, kiến trúc hệ thống..."
                    id="input-description-vi"
                  />
                </div>

                {/* Highlights VI */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-highlight-vi"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Điểm nổi bật (VI) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "highlightVi",
                          "highlightEn",
                          "vi",
                          "en",
                          "Key technical achievements and notable features of the project",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.highlightVi?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch điểm nổi bật sang Tiếng Anh"
                      id="btn-translate-highlight-vi"
                    >
                      {translatingKey === "highlightVi" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang EN
                    </button>
                  </div>
                  <Textarea
                    value={form.highlightVi}
                    onChange={(e) => set("highlightVi", e.target.value)}
                    required
                    error={errors.highlightVi}
                    rows={4}
                    placeholder="Các tính năng trọng tâm, tối ưu hóa hiệu năng, công nghệ áp dụng..."
                    id="input-highlight-vi"
                  />
                </div>
              </div>

              {/* Cột Tiếng Anh */}
              <div className="space-y-5 rounded-xl border border-border/80 bg-bg/40 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none">🇬🇧</span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                        English Content
                      </h3>
                      <p className="text-[11px] text-text-muted truncate">
                        Displayed on the English version interface
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={translatingAll === "en2vi"}
                    disabled={
                      translatingAll !== null ||
                      translatingKey !== null ||
                      (!form.titleEn?.trim() &&
                        !form.descriptionEn?.trim() &&
                        !form.highlightEn?.trim())
                    }
                    icon={<Sparkles size={14} className="text-accent" />}
                    onClick={() => handleTranslateAll("en2vi")}
                    title="Tự động dịch tất cả các mục từ Tiếng Anh sang Tiếng Việt"
                    id="btn-translate-all-en-to-vi"
                    className="shrink-0 text-xs"
                  >
                    Dịch EN ➔ VI
                  </Button>
                </div>

                {/* Title EN */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-title-en"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Project Title (EN) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "titleEn",
                          "titleVi",
                          "en",
                          "vi",
                          "Tên dự án công nghệ / phần mềm",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.titleEn?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch tên dự án sang Tiếng Việt"
                      id="btn-translate-title-en"
                    >
                      {translatingKey === "titleEn" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang VI
                    </button>
                  </div>
                  <Input
                    value={form.titleEn}
                    onChange={(e) => set("titleEn", e.target.value)}
                    required
                    error={errors.titleEn}
                    placeholder="e.g. E-commerce Platform..."
                    id="input-title-en"
                  />
                </div>

                {/* Description EN */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-description-en"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Description (EN) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "descriptionEn",
                          "descriptionVi",
                          "en",
                          "vi",
                          "Mô tả chi tiết dự án công nghệ / phần mềm",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.descriptionEn?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch mô tả dự án sang Tiếng Việt"
                      id="btn-translate-desc-en"
                    >
                      {translatingKey === "descriptionEn" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang VI
                    </button>
                  </div>
                  <Textarea
                    value={form.descriptionEn}
                    onChange={(e) => set("descriptionEn", e.target.value)}
                    required
                    error={errors.descriptionEn}
                    rows={5}
                    placeholder="Overview of the project, problem solved, architecture..."
                    id="input-description-en"
                  />
                </div>

                {/* Highlights EN */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-highlight-en"
                      className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Highlights (EN) <span className="ml-0.5 text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTranslateField(
                          "highlightEn",
                          "highlightVi",
                          "en",
                          "vi",
                          "Điểm nổi bật, tính năng chính và thành tựu kỹ thuật của dự án",
                        )
                      }
                      disabled={
                        translatingKey !== null ||
                        translatingAll !== null ||
                        !form.highlightEn?.trim()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Dịch điểm nổi bật sang Tiếng Việt"
                      id="btn-translate-highlight-en"
                    >
                      {translatingKey === "highlightEn" ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Dịch sang VI
                    </button>
                  </div>
                  <Textarea
                    value={form.highlightEn}
                    onChange={(e) => set("highlightEn", e.target.value)}
                    required
                    error={errors.highlightEn}
                    rows={4}
                    placeholder="Key highlights, performance achievements, technologies applied..."
                    id="input-highlight-en"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Duration & Order Card */}
          <Card>
            <CardHeader
              title="Thời gian & Thứ tự"
              subtitle="Thời gian thực hiện dự án và thứ tự hiển thị ưu tiên"
            />
            <div className="space-y-5">
              <BilingualMonthYearPicker
                valueVi={form.completeTimeVi}
                valueEn={form.completeTimeEn}
                onChangeVi={(v) => set("completeTimeVi", v)}
                onChangeEn={(v) => set("completeTimeEn", v)}
                required
                errorVi={errors.completeTimeVi}
                errorEn={errors.completeTimeEn}
              />
              <Input
                label="Thứ tự hiển thị"
                type="number"
                value={String(form.orderIndex)}
                onChange={(e) =>
                  set("orderIndex", parseInt(e.target.value) || 0)
                }
                error={errors.orderIndex}
                hint="Số nhỏ hơn sẽ hiển thị trước (0 là ưu tiên cao nhất)"
                id="project-order"
              />

              <div className="pt-3 border-t border-border/60">
                <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Hiển thị trên Portfolio
                    </span>
                    <p className="text-xs text-text-muted mt-0.5">
                      Bật để dự án xuất hiện trên trang Portfolio công khai
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isVisible ?? true}
                    onChange={(e) => set("isVisible", e.target.checked)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                    id="project-is-visible"
                  />
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: skills + urls (sticky) */}
        <div className="space-y-5 xl:sticky xl:top-20 xl:self-start">
          {/* Skills */}
          <Card>
            <CardHeader
              title="Skills liên quan"
              subtitle="Chọn các kỹ năng sử dụng trong dự án"
            />
            <SkillTagPicker
              skills={allSkills}
              selectedIds={form.skillIds}
              onChange={(ids) => set("skillIds", ids)}
            />
          </Card>

          {/* URLs */}
          <Card>
            <CardHeader
              title="Liên kết dự án"
              subtitle="GitHub, Demo, Documentation..."
            />
            <DynamicUrlList
              urls={form.urls}
              onChange={(urls) => set("urls", urls)}
              errors={errors.urls ?? []}
            />
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate("/admin/projects")}
              id="cancel-project-btn"
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              loading={saving}
              icon={<Save size={14} />}
              id="save-project-btn"
            >
              {isEdit ? "Cập nhật" : "Tạo dự án"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { projects, loading: projectsLoading, create, update, saving } =
    useProjects();
  const { allSkills, loading: skillsLoading } = useSkills();

  const existing = useMemo(
    () => (isEdit && id ? projects.find((p) => p.id === parseInt(id)) : null),
    [projects, id, isEdit],
  );

  const isLoading =
    projectsLoading || skillsLoading || (isEdit && !existing && projects.length === 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const initialForm: ProjectRequest = existing
    ? {
        titleVi: existing.titleVi,
        titleEn: existing.titleEn,
        completeTimeVi: existing.completeTimeVi,
        completeTimeEn: existing.completeTimeEn,
        descriptionVi: existing.descriptionVi,
        descriptionEn: existing.descriptionEn,
        highlightVi: existing.highlightVi,
        highlightEn: existing.highlightEn,
        orderIndex: existing.orderIndex,
        isVisible: existing.isVisible ?? true,
        skillIds: existing.skills.map((s) => s.id),
        urls: existing.urls,
      }
    : EMPTY;

  const handleSubmit = async (form: ProjectRequest) => {
    let result;
    if (isEdit && id) {
      result = await update(parseInt(id), form);
    } else {
      result = await create(form);
    }
    if (result) {
      navigate("/admin/projects");
      return true;
    }
    return false;
  };

  return (
    <ProjectForm
      key={existing ? `edit-${existing.id}` : "create"}
      initialForm={initialForm}
      isEdit={isEdit}
      allSkills={allSkills}
      saving={saving}
      onSubmit={handleSubmit}
    />
  );
}
