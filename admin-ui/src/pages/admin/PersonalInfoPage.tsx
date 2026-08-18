import { useLayoutEffect, useState, useRef } from "react";
import { usePersonal } from "../../hooks/usePersonal";
import { useAdminLayout } from "../../components/layout/AdminLayoutContext";
import { useToast } from "../../context/ToastContext";
import { personalService } from "../../services/personalService";
import { translationService } from "../../services/translationService";
import { Card, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { Modal } from "../../components/common/Modal";
import type { PersonalInfoRequest } from "../../types/api";
import {
  Save,
  User,
  Pencil,
  X,
  FileText,
  ExternalLink,
  Eye,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Trash2,
  Link2,
  Camera,
  Sparkles,
} from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/;

type Errors = Partial<Record<keyof PersonalInfoRequest, string>>;

function validate(form: PersonalInfoRequest): Errors {
  const errs: Errors = {};
  if (!form.name?.trim()) errs.name = "Bắt buộc";
  else if (form.name.length > 100) errs.name = "Tối đa 100 ký tự";
  if (!form.summaryVi?.trim()) errs.summaryVi = "Bắt buộc";
  if (!form.summaryEn?.trim()) errs.summaryEn = "Bắt buộc";
  if (!form.email?.trim()) errs.email = "Bắt buộc";
  else if (!EMAIL_RE.test(form.email)) errs.email = "Email không hợp lệ";
  else if (form.email.length > 100) errs.email = "Tối đa 100 ký tự";
  if (!form.phone?.trim()) errs.phone = "Bắt buộc";
  else if (form.phone.length > 20) errs.phone = "Tối đa 20 ký tự";
  if (!form.locationVi?.trim()) errs.locationVi = "Bắt buộc";
  else if (form.locationVi.length > 150) errs.locationVi = "Tối đa 150 ký tự";
  if (!form.locationEn?.trim()) errs.locationEn = "Bắt buộc";
  else if (form.locationEn.length > 150) errs.locationEn = "Tối đa 150 ký tự";
  if (form.linkedinUrl && !URL_RE.test(form.linkedinUrl))
    errs.linkedinUrl = "URL không hợp lệ";
  if (form.githubUrl && !URL_RE.test(form.githubUrl))
    errs.githubUrl = "URL không hợp lệ";
  if (form.avatarUrl && !URL_RE.test(form.avatarUrl))
    errs.avatarUrl = "URL không hợp lệ";
  if (form.cvUrl && !URL_RE.test(form.cvUrl))
    errs.cvUrl = "URL không hợp lệ";
  return errs;
}

const EMPTY: PersonalInfoRequest = {
  name: "",
  titleVi: "",
  titleEn: "",
  summaryVi: "",
  summaryEn: "",
  email: "",
  phone: "",
  locationVi: "",
  locationEn: "",
  linkedinUrl: "",
  githubUrl: "",
  avatarUrl: "",
  cvUrl: "",
};

function formatInitialData(data: PersonalInfoRequest | null): PersonalInfoRequest {
  if (!data) return EMPTY;
  return {
    name: data.name ?? "",
    titleVi: data.titleVi ?? "",
    titleEn: data.titleEn ?? "",
    summaryVi: data.summaryVi ?? "",
    summaryEn: data.summaryEn ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    locationVi: data.locationVi ?? "",
    locationEn: data.locationEn ?? "",
    linkedinUrl: data.linkedinUrl ?? "",
    githubUrl: data.githubUrl ?? "",
    avatarUrl: data.avatarUrl ?? "",
    cvUrl: data.cvUrl ?? "",
  };
}

interface PersonalInfoFormProps {
  initialData: PersonalInfoRequest | null;
  saving: boolean;
  onSave: (payload: PersonalInfoRequest) => Promise<boolean>;
}

function PersonalInfoForm({
  initialData,
  saving,
  onSave,
}: PersonalInfoFormProps) {
  const { setSaveSlot } = useAdminLayout();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PersonalInfoRequest>(() =>
    formatInitialData(initialData),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [showManualAvatarUrl, setShowManualAvatarUrl] = useState(false);
  const [translatingKey, setTranslatingKey] = useState<string | null>(null);
  const [translatingAll, setTranslatingAll] = useState<"vi2en" | "en2vi" | null>(null);

  const set = <K extends keyof PersonalInfoRequest>(
    key: K,
    value: PersonalInfoRequest[K],
  ) => {
    if (!isEditing) return;
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTranslateField = async (
    sourceKey: "titleVi" | "titleEn" | "locationVi" | "locationEn" | "summaryVi" | "summaryEn",
    targetKey: "titleVi" | "titleEn" | "locationVi" | "locationEn" | "summaryVi" | "summaryEn",
    sourceLang: "vi" | "en",
    targetLang: "vi" | "en",
    context: string,
  ) => {
    if (!isEditing) return;
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
    if (!isEditing) return;
    const isViToEn = direction === "vi2en";
    const sourceLang = isViToEn ? "vi" : "en";
    const targetLang = isViToEn ? "en" : "vi";

    const fieldsToTranslate = isViToEn
      ? [
          {
            sourceKey: "titleVi" as const,
            targetKey: "titleEn" as const,
            text: form.titleVi?.trim(),
            context: "Professional job title for software developer",
          },
          {
            sourceKey: "locationVi" as const,
            targetKey: "locationEn" as const,
            text: form.locationVi?.trim(),
            context: "City / Location / Address",
          },
          {
            sourceKey: "summaryVi" as const,
            targetKey: "summaryEn" as const,
            text: form.summaryVi?.trim(),
            context: "Professional summary and bio for software engineer",
          },
        ]
      : [
          {
            sourceKey: "titleEn" as const,
            targetKey: "titleVi" as const,
            text: form.titleEn?.trim(),
            context: "Tiêu đề nghề nghiệp kỹ sư phần mềm / lập trình viên",
          },
          {
            sourceKey: "locationEn" as const,
            targetKey: "locationVi" as const,
            text: form.locationEn?.trim(),
            context: "Địa điểm / Tỉnh thành / Quốc gia",
          },
          {
            sourceKey: "summaryEn" as const,
            targetKey: "summaryVi" as const,
            text: form.summaryEn?.trim(),
            context: "Tóm tắt hồ sơ năng lực và kinh nghiệm kỹ sư phần mềm",
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
      setDirty(true);

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

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
    if (!isImage) {
      addToast("Chỉ hỗ trợ file hình ảnh (JPG, PNG, WEBP, GIF, SVG)", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast("Dung lượng ảnh tối đa là 10MB", "error");
      return;
    }

    setUploadingAvatar(true);
    try {
      const res = await personalService.uploadAvatar(file);
      set("avatarUrl", res.url);
      addToast("Tải ảnh đại diện lên đám mây thành công!", "success");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Tải ảnh đại diện thất bại";
      addToast(errorMsg, "error");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleCvUpload = async (file: File) => {
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      addToast("Chỉ hỗ trợ file định dạng PDF (.pdf)", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast("Dung lượng file tối đa là 10MB", "error");
      return;
    }

    setUploadingCv(true);
    try {
      const res = await personalService.uploadCv(file);
      set("cvUrl", res.url);
      addToast("Tải file CV lên đám mây thành công!", "success");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Tải lên file CV thất bại";
      addToast(errorMsg, "error");
    } finally {
      setUploadingCv(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!isEditing || uploadingCv) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleCvUpload(file);
    }
  };

  const handleCancel = () => {
    setForm(formatInitialData(initialData));
    setErrors({});
    setDirty(false);
    setIsEditing(false);
    setShowManualUrl(false);
    setShowManualAvatarUrl(false);
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const ok = await onSave(form);
    if (ok) {
      setDirty(false);
      setIsEditing(false);
    }
  };

  // Inject Save / Edit / Cancel buttons into topbar
  useLayoutEffect(() => {
    setSaveSlot(
      isEditing ? (
        <div className="flex items-center gap-2">
          {dirty && (
            <Badge variant="accent" className="text-xs">
              Chưa lưu
            </Badge>
          )}
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
            icon={<X size={14} />}
            size="sm"
            id="personal-cancel-btn"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={!dirty}
            icon={<Save size={14} />}
            size="sm"
            id="personal-save-btn"
          >
            Lưu
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsEditing(true)}
          icon={<Pencil size={14} />}
          size="sm"
          id="personal-edit-btn"
        >
          Chỉnh sửa
        </Button>
      ),
    );
    return () => setSaveSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, dirty, saving, form]);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader
          title="Thông tin cơ bản"
          subtitle="Ảnh đại diện, họ và tên, email và số điện thoại"
        />
        <div className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-border bg-bg/50 p-4">
            {/* Hidden Avatar File Input */}
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              id="avatar-file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />

            {/* Circular Avatar with Hover / Loading Overlay */}
            <div className="relative group flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-surface shadow-sm">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.name || "Avatar"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const fallback = (
                      e.target as HTMLElement
                    ).parentElement?.querySelector(".avatar-fallback");
                    if (fallback)
                      (fallback as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="avatar-fallback flex h-full w-full items-center justify-center bg-border/40 text-text-muted"
                style={{ display: form.avatarUrl ? "none" : "flex" }}
              >
                <User size={36} />
              </div>

              {/* Uploading Spinner Overlay */}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10 backdrop-blur-xs">
                  <Loader2 size={24} className="animate-spin text-accent" />
                  <span className="text-[10px] font-medium mt-1">Đang tải...</span>
                </div>
              )}

              {/* Edit Mode Hover Overlay on Avatar */}
              {isEditing && !uploadingAvatar && (
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera size={20} />
                  <span className="text-[10px] font-medium mt-0.5">Đổi ảnh</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={uploadingAvatar}
                    icon={<Camera size={14} />}
                    onClick={() => avatarInputRef.current?.click()}
                    id="upload-avatar-btn"
                  >
                    {form.avatarUrl ? "Thay đổi ảnh" : "Tải ảnh lên"}
                  </Button>

                  {form.avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      icon={<Trash2 size={14} />}
                      onClick={() => set("avatarUrl", "")}
                      title="Gỡ ảnh đại diện"
                    >
                      Gỡ ảnh
                    </Button>
                  )}
                </div>

                <p className="text-xs text-text-muted">
                  Hỗ trợ định dạng JPG, PNG, WEBP, GIF (tối đa 10MB). Tự động tải lên Cloudinary.
                </p>

                {/* Manual URL toggle fallback */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowManualAvatarUrl(!showManualAvatarUrl)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Link2 size={12} />
                    {showManualAvatarUrl
                      ? "Ẩn nhập URL ảnh thủ công"
                      : "Hoặc chỉnh sửa URL ảnh thủ công"}
                  </button>

                  {showManualAvatarUrl && (
                    <div className="mt-2">
                      <Input
                        label="URL Ảnh đại diện (Tùy chọn ghi đè)"
                        value={form.avatarUrl ?? ""}
                        onChange={(e) => set("avatarUrl", e.target.value)}
                        error={errors.avatarUrl}
                        placeholder="https://res.cloudinary.com/..."
                        id="input-avatar"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <span className="text-base font-medium text-text-primary">
                  {form.name || "Chưa thiết lập tên"}
                </span>
                <span className="text-xs text-text-muted">
                  {form.titleVi || form.titleEn || "Chưa thiết lập tiêu đề"}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Họ và tên"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            error={errors.name}
            maxLength={100}
            readOnly={!isEditing}
            id="input-name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              error={errors.email}
              maxLength={100}
              readOnly={!isEditing}
              id="input-email"
            />
            <Input
              label="Số điện thoại"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              required
              error={errors.phone}
              maxLength={20}
              readOnly={!isEditing}
              id="input-phone"
            />
          </div>
        </div>
      </Card>

      {/* Bilingual Content */}
      <Card>
        <CardHeader
          title="Nội dung song ngữ"
          subtitle="Thông tin chuyên môn hiển thị theo 2 ngôn ngữ Tiếng Việt & Tiếng Anh"
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

              {isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={translatingAll === "vi2en"}
                  disabled={
                    translatingAll !== null ||
                    translatingKey !== null ||
                    (!form.titleVi?.trim() &&
                      !form.locationVi?.trim() &&
                      !form.summaryVi?.trim())
                  }
                  icon={<Sparkles size={14} className="text-accent" />}
                  onClick={() => handleTranslateAll("vi2en")}
                  title="Tự động dịch tất cả các mục từ Tiếng Việt sang Tiếng Anh"
                  id="btn-translate-all-vi-to-en"
                  className="shrink-0 text-xs"
                >
                  Dịch VI ➔ EN
                </Button>
              )}
            </div>

            {/* Title VI */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-title-vi"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Tiêu đề nghề nghiệp (VI)
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "titleVi",
                        "titleEn",
                        "vi",
                        "en",
                        "Professional job title for software engineer / developer",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.titleVi?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch tiêu đề sang Tiếng Anh"
                    id="btn-translate-title-vi"
                  >
                    {translatingKey === "titleVi" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang EN
                  </button>
                )}
              </div>
              <Input
                value={form.titleVi ?? ""}
                onChange={(e) => set("titleVi", e.target.value)}
                error={errors.titleVi}
                maxLength={100}
                placeholder="VD: Senior Full-Stack Developer"
                readOnly={!isEditing}
                id="input-title-vi"
              />
            </div>

            {/* Location VI */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-location-vi"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Địa điểm (VI) <span className="ml-0.5 text-danger">*</span>
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "locationVi",
                        "locationEn",
                        "vi",
                        "en",
                        "City and country location address",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.locationVi?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch địa điểm sang Tiếng Anh"
                    id="btn-translate-location-vi"
                  >
                    {translatingKey === "locationVi" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang EN
                  </button>
                )}
              </div>
              <Input
                value={form.locationVi}
                onChange={(e) => set("locationVi", e.target.value)}
                required
                error={errors.locationVi}
                maxLength={150}
                placeholder="VD: TP. Hồ Chí Minh, Việt Nam"
                readOnly={!isEditing}
                id="input-location-vi"
              />
            </div>

            {/* Summary VI */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-summary-vi"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Tóm tắt giới thiệu (VI) <span className="ml-0.5 text-danger">*</span>
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "summaryVi",
                        "summaryEn",
                        "vi",
                        "en",
                        "Professional summary and bio for software engineer portfolio",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.summaryVi?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch tóm tắt giới thiệu sang Tiếng Anh"
                    id="btn-translate-summary-vi"
                  >
                    {translatingKey === "summaryVi" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang EN
                  </button>
                )}
              </div>
              <Textarea
                value={form.summaryVi}
                onChange={(e) => set("summaryVi", e.target.value)}
                required
                error={errors.summaryVi}
                rows={6}
                placeholder="Mô tả tóm tắt về kinh nghiệm, thế mạnh và định hướng nghề nghiệp..."
                readOnly={!isEditing}
                id="input-summary-vi"
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

              {isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={translatingAll === "en2vi"}
                  disabled={
                    translatingAll !== null ||
                    translatingKey !== null ||
                    (!form.titleEn?.trim() &&
                      !form.locationEn?.trim() &&
                      !form.summaryEn?.trim())
                  }
                  icon={<Sparkles size={14} className="text-accent" />}
                  onClick={() => handleTranslateAll("en2vi")}
                  title="Tự động dịch tất cả các mục từ Tiếng Anh sang Tiếng Việt"
                  id="btn-translate-all-en-to-vi"
                  className="shrink-0 text-xs"
                >
                  Dịch EN ➔ VI
                </Button>
              )}
            </div>

            {/* Title EN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-title-en"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Professional Title (EN)
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "titleEn",
                        "titleVi",
                        "en",
                        "vi",
                        "Tiêu đề nghề nghiệp kỹ sư phần mềm / lập trình viên",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.titleEn?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch tiêu đề nghề nghiệp sang Tiếng Việt"
                    id="btn-translate-title-en"
                  >
                    {translatingKey === "titleEn" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang VI
                  </button>
                )}
              </div>
              <Input
                value={form.titleEn ?? ""}
                onChange={(e) => set("titleEn", e.target.value)}
                error={errors.titleEn}
                maxLength={100}
                placeholder="e.g. Senior Full-Stack Developer"
                readOnly={!isEditing}
                id="input-title-en"
              />
            </div>

            {/* Location EN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-location-en"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Location (EN) <span className="ml-0.5 text-danger">*</span>
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "locationEn",
                        "locationVi",
                        "en",
                        "vi",
                        "Địa điểm tỉnh/thành phố và quốc gia",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.locationEn?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch địa điểm sang Tiếng Việt"
                    id="btn-translate-location-en"
                  >
                    {translatingKey === "locationEn" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang VI
                  </button>
                )}
              </div>
              <Input
                value={form.locationEn}
                onChange={(e) => set("locationEn", e.target.value)}
                required
                error={errors.locationEn}
                maxLength={150}
                placeholder="e.g. Ho Chi Minh City, Vietnam"
                readOnly={!isEditing}
                id="input-location-en"
              />
            </div>

            {/* Summary EN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-summary-en"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Summary / Bio (EN) <span className="ml-0.5 text-danger">*</span>
                </label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTranslateField(
                        "summaryEn",
                        "summaryVi",
                        "en",
                        "vi",
                        "Tóm tắt hồ sơ năng lực và kinh nghiệm kỹ sư phần mềm",
                      )
                    }
                    disabled={
                      translatingKey !== null ||
                      translatingAll !== null ||
                      !form.summaryEn?.trim()
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Dịch tóm tắt sang Tiếng Việt"
                    id="btn-translate-summary-en"
                  >
                    {translatingKey === "summaryEn" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Dịch sang VI
                  </button>
                )}
              </div>
              <Textarea
                value={form.summaryEn}
                onChange={(e) => set("summaryEn", e.target.value)}
                required
                error={errors.summaryEn}
                rows={6}
                placeholder="Brief overview of your experience, key skills, and career focus..."
                readOnly={!isEditing}
                id="input-summary-en"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* CV / Resume Section */}
      <Card>
        <CardHeader
          title="Hồ sơ & CV (Curriculum Vitae)"
          subtitle="Tải lên và quản lý liên kết file CV/Resume lên đám mây"
        />
        <div className="space-y-5">
          {/* CV Preview Box (When not editing or as a summary) */}
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-bg/50 p-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent shadow-sm">
                  <FileText size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {form.cvUrl ? "File CV đã liên kết" : "Chưa có liên kết CV"}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {form.cvUrl
                      ? form.cvUrl
                      : "Bấm 'Chỉnh sửa' ở góc trên để tải lên file CV của bạn"}
                  </p>
                </div>
              </div>

              {form.cvUrl && (
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => setShowCvModal(true)}
                    id="preview-cv-btn"
                  >
                    Xem trước
                  </Button>
                  <a
                    href={form.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-border/40 transition-colors"
                    id="open-cv-external-btn"
                  >
                    <ExternalLink size={13} />
                    Mở tab mới
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,application/pdf"
                className="hidden"
                id="cv-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCvUpload(file);
                }}
              />

              {uploadingCv ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-accent/60 bg-accent/5 p-8 text-center animate-pulse">
                  <Loader2 size={36} className="animate-spin text-accent" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Đang tải file PDF lên máy chủ và Cloudinary...
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Dropzone Upload Area */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      dragOver
                        ? "border-accent bg-accent/10 scale-[1.01]"
                        : "border-border hover:border-accent/50 bg-bg/40 hover:bg-bg/70"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-xs border border-border text-accent group-hover:scale-105 transition-transform">
                      <UploadCloud size={24} />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-primary">
                        Kéo thả file CV (PDF) vào đây hoặc{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-accent hover:underline font-semibold cursor-pointer"
                        >
                          chọn từ máy tính
                        </button>
                      </p>
                      <p className="text-xs text-text-muted">
                        Chỉ chấp nhận file định dạng PDF, tối đa 10MB
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={<UploadCloud size={14} />}
                      onClick={() => fileInputRef.current?.click()}
                      id="upload-cv-file-btn"
                    >
                      Chọn file PDF để tải lên
                    </Button>
                  </div>

                  {/* Current CV link status in edit mode */}
                  {form.cvUrl && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-surface/80 p-3.5 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-emerald-500"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text-muted">
                            Đường dẫn CV hiện tại:
                          </p>
                          <p
                            className="text-xs font-mono text-text-primary truncate"
                            title={form.cvUrl}
                          >
                            {form.cvUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => setShowCvModal(true)}
                        >
                          Xem trước
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          icon={<Trash2 size={14} />}
                          onClick={() => set("cvUrl", "")}
                          title="Xóa liên kết CV"
                        >
                          Gỡ bỏ
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Manual URL input fallback toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <Link2 size={12} />
                      {showManualUrl
                        ? "Ẩn nhập URL thủ công"
                        : "Hoặc chỉnh sửa URL thủ công"}
                    </button>

                    {showManualUrl && (
                      <div className="mt-2">
                        <Input
                          label="URL File CV (Tùy chọn ghi đè)"
                          value={form.cvUrl ?? ""}
                          onChange={(e) => set("cvUrl", e.target.value)}
                          error={errors.cvUrl}
                          placeholder="https://res.cloudinary.com/..."
                          id="input-cv"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader
          title="Mạng xã hội & Khác"
          subtitle="URL LinkedIn, GitHub"
        />
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="LinkedIn URL"
              value={form.linkedinUrl ?? ""}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              error={errors.linkedinUrl}
              placeholder="https://linkedin.com/in/..."
              readOnly={!isEditing}
              id="input-linkedin"
            />
            <Input
              label="GitHub URL"
              value={form.githubUrl ?? ""}
              onChange={(e) => set("githubUrl", e.target.value)}
              error={errors.githubUrl}
              placeholder="https://github.com/..."
              readOnly={!isEditing}
              id="input-github"
            />
          </div>
        </div>
      </Card>

      {/* CV Preview Modal */}
      <Modal
        open={showCvModal}
        onClose={() => setShowCvModal(false)}
        title="Xem trước CV / Resume"
        maxWidth="xl"
      >
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-bg/50 px-3 py-2 text-xs text-text-muted border border-border/60">
            <span className="truncate max-w-full sm:max-w-md font-mono">
              {form.cvUrl}
            </span>
            <a
              href={form.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium shrink-0 self-end sm:self-auto"
            >
              <ExternalLink size={13} /> Mở tab mới
            </a>
          </div>
          <div className="relative h-[55vh] sm:h-[65vh] md:h-[70vh] min-h-70 max-h-187.5 w-full rounded-lg border border-border bg-surface-muted/20 overflow-hidden shadow-inner">
            <iframe
              src={form.cvUrl}
              title="CV Preview"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PersonalInfoPage() {
  const { data, loading, saving, save } = usePersonal();

  if (loading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <PersonalInfoForm
      key={data ? "loaded" : "empty"}
      initialData={data}
      saving={saving}
      onSave={save}
    />
  );
}
