import { useLayoutEffect, useState } from "react";
import { usePersonal } from "../../hooks/usePersonal";
import { useAdminLayout } from "../../components/layout/AdminLayoutContext";
import { Card, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { BilingualField } from "../../components/common/BilingualField";
import type { PersonalInfoRequest } from "../../types/api";
import { Save, User, Pencil, X } from "lucide-react";

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
  const [form, setForm] = useState<PersonalInfoRequest>(() =>
    formatInitialData(initialData),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const set = <K extends keyof PersonalInfoRequest>(
    key: K,
    value: PersonalInfoRequest[K],
  ) => {
    if (!isEditing) return;
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleCancel = () => {
    setForm(formatInitialData(initialData));
    setErrors({});
    setDirty(false);
    setIsEditing(false);
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
    <div className="max-w-3xl space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader
          title="Thông tin cơ bản"
          subtitle="Tên, email, số điện thoại và ảnh đại diện"
        />
        <div className="space-y-5">
          {form.avatarUrl && (
            <div className="flex items-center gap-4">
              <img
                src={form.avatarUrl}
                alt="Avatar preview"
                className="h-16 w-16 rounded-full object-cover border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-border">
                <User size={24} className="text-text-muted" />
              </div>
            </div>
          )}
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
          <div className="grid grid-cols-2 gap-4">
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
          subtitle="Tiêu đề và tóm tắt bằng tiếng Việt và tiếng Anh"
        />
        <div className="space-y-6">
          <BilingualField
            labelVi="Tiêu đề (VI)"
            labelEn="Tiêu đề (EN)"
            valueVi={form.titleVi ?? ""}
            valueEn={form.titleEn ?? ""}
            onChangeVi={(v) => set("titleVi", v)}
            onChangeEn={(v) => set("titleEn", v)}
            readOnly={!isEditing}
          />
          <BilingualField
            labelVi="Tóm tắt (VI)"
            labelEn="Summary (EN)"
            valueVi={form.summaryVi}
            valueEn={form.summaryEn}
            onChangeVi={(v) => set("summaryVi", v)}
            onChangeEn={(v) => set("summaryEn", v)}
            type="textarea"
            required
            errorVi={errors.summaryVi}
            errorEn={errors.summaryEn}
            rows={5}
            readOnly={!isEditing}
          />
          <BilingualField
            labelVi="Địa điểm (VI)"
            labelEn="Location (EN)"
            valueVi={form.locationVi}
            valueEn={form.locationEn}
            onChangeVi={(v) => set("locationVi", v)}
            onChangeEn={(v) => set("locationEn", v)}
            required
            errorVi={errors.locationVi}
            errorEn={errors.locationEn}
            readOnly={!isEditing}
          />
        </div>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader
          title="Liên kết"
          subtitle="URL LinkedIn, GitHub, ảnh đại diện, CV"
        />
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Avatar URL"
              value={form.avatarUrl ?? ""}
              onChange={(e) => set("avatarUrl", e.target.value)}
              error={errors.avatarUrl}
              placeholder="https://..."
              readOnly={!isEditing}
              id="input-avatar"
            />
            <Input
              label="CV URL"
              value={form.cvUrl ?? ""}
              onChange={(e) => set("cvUrl", e.target.value)}
              error={errors.cvUrl}
              placeholder="https://..."
              readOnly={!isEditing}
              id="input-cv"
            />
          </div>
        </div>
      </Card>
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
