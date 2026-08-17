import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useSkills } from "../../hooks/useSkills";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { BilingualField } from "../../components/common/BilingualField";
import { SkillTagPicker } from "../../components/projects/SkillTagPicker";
import { DynamicUrlList } from "../../components/projects/DynamicUrlList";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { ProjectRequest, ProjectUrl, SkillResponse } from "../../types/api";
import { Save, ArrowLeft } from "lucide-react";

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
  const [form, setForm] = useState<ProjectRequest>(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof ProjectRequest>(
    key: K,
    value: ProjectRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
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
    <div className="space-y-4">
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
        <h1 className="text-lg font-semibold text-text-primary">
          {isEdit ? "Sửa dự án" : "Tạo dự án mới"}
        </h1>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left column: bilingual content */}
        <div className="space-y-5 min-w-0">
          <Card>
            <CardHeader title="Thông tin song ngữ" />
            <div className="space-y-6">
              <BilingualField
                labelVi="Tên dự án (VI)"
                labelEn="Project Title (EN)"
                valueVi={form.titleVi}
                valueEn={form.titleEn}
                onChangeVi={(v) => set("titleVi", v)}
                onChangeEn={(v) => set("titleEn", v)}
                required
                errorVi={errors.titleVi}
                errorEn={errors.titleEn}
              />
              <BilingualField
                labelVi="Thời gian (VI)"
                labelEn="Completion time (EN)"
                valueVi={form.completeTimeVi}
                valueEn={form.completeTimeEn}
                onChangeVi={(v) => set("completeTimeVi", v)}
                onChangeEn={(v) => set("completeTimeEn", v)}
                required
                errorVi={errors.completeTimeVi}
                errorEn={errors.completeTimeEn}
              />
              <BilingualField
                labelVi="Mô tả (VI)"
                labelEn="Description (EN)"
                valueVi={form.descriptionVi}
                valueEn={form.descriptionEn}
                onChangeVi={(v) => set("descriptionVi", v)}
                onChangeEn={(v) => set("descriptionEn", v)}
                type="textarea"
                required
                errorVi={errors.descriptionVi}
                errorEn={errors.descriptionEn}
                rows={5}
              />
              <BilingualField
                labelVi="Điểm nổi bật (VI)"
                labelEn="Highlights (EN)"
                valueVi={form.highlightVi}
                valueEn={form.highlightEn}
                onChangeVi={(v) => set("highlightVi", v)}
                onChangeEn={(v) => set("highlightEn", v)}
                type="textarea"
                required
                errorVi={errors.highlightVi}
                errorEn={errors.highlightEn}
                rows={3}
              />
              <Input
                label="Thứ tự hiển thị"
                type="number"
                value={String(form.orderIndex)}
                onChange={(e) =>
                  set("orderIndex", parseInt(e.target.value) || 0)
                }
                error={errors.orderIndex}
                id="project-order"
              />
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
