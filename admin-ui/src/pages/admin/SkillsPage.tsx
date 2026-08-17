import { useLayoutEffect, useState } from "react";
import { useSkills } from "../../hooks/useSkills";
import { useAdminLayout } from "../../components/layout/AdminLayoutContext";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { SortableList } from "../../components/common/SortableList";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { SkillCategory, type SkillRequest, type SkillResponse } from "../../types/api";
import { Plus, Pencil, Trash2 } from "lucide-react";

// ─── Category labels ──────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.TECH]: "Công nghệ (Tech)",
  [SkillCategory.TOOL]: "Công cụ (Tool)",
};

const CATEGORY_OPTIONS = Object.values(SkillCategory).map((c) => ({
  value: c,
  label: CATEGORY_LABELS[c],
}));

// ─── Skill Form Modal ─────────────────────────────────────────────────────────
type SkillForm = SkillRequest;
type SkillErrors = Partial<Record<keyof SkillForm, string>>;

function validateSkill(f: SkillForm): SkillErrors {
  const e: SkillErrors = {};
  if (!f.title.trim()) e.title = "Bắt buộc";
  else if (f.title.length > 50) e.title = "Tối đa 50 ký tự";
  if (!f.iconClass.trim()) e.iconClass = "Bắt buộc";
  else if (f.iconClass.length > 100) e.iconClass = "Tối đa 100 ký tự";
  if (!f.category) e.category = "Bắt buộc";
  if (f.orderIndex < 0) e.orderIndex = "Phải >= 0";
  return e;
}

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  initial?: SkillResponse | null;
  onSave: (form: SkillForm) => Promise<boolean>;
  saving: boolean;
}

interface SkillModalFormProps {
  initial?: SkillResponse | null;
  onSave: (form: SkillForm) => Promise<boolean>;
  saving: boolean;
  onClose: () => void;
}

function SkillModalForm({
  initial,
  onSave,
  saving,
  onClose,
}: SkillModalFormProps) {
  const [form, setForm] = useState<SkillForm>(() =>
    initial
      ? {
          title: initial.title,
          iconClass: initial.iconClass,
          category: initial.category ?? SkillCategory.TECH,
          orderIndex: initial.orderIndex ?? 0,
        }
      : {
          title: "",
          iconClass: "",
          category: SkillCategory.TECH,
          orderIndex: 0,
        },
  );
  const [errors, setErrors] = useState<SkillErrors>({});

  const set = <K extends keyof SkillForm>(k: K, v: SkillForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateSkill(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const ok = await onSave(form);
    if (ok) onClose();
  };

  return (
    <div className="space-y-5">
      <Input
        label="Tên kỹ năng"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        required
        error={errors.title}
        maxLength={50}
        id="skill-title"
      />
      <div>
        <Input
          label="Icon Class"
          value={form.iconClass}
          onChange={(e) => set("iconClass", e.target.value)}
          required
          error={errors.iconClass}
          maxLength={100}
          placeholder="devicon-react-original colored"
          id="skill-icon-class"
        />
        {form.iconClass && (
          <div className="mt-2 flex items-center gap-2">
            <i className={`${form.iconClass} text-2xl`} />
            <span className="text-xs text-text-muted">Preview</span>
          </div>
        )}
      </div>
      <Select
        label="Danh mục"
        value={form.category}
        onChange={(e) => set("category", e.target.value as SkillCategory)}
        options={CATEGORY_OPTIONS}
        required
        error={errors.category}
        id="skill-category"
      />
      <Input
        label="Thứ tự"
        type="number"
        value={String(form.orderIndex)}
        onChange={(e) => set("orderIndex", parseInt(e.target.value) || 0)}
        error={errors.orderIndex}
        id="skill-order"
      />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Hủy
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          loading={saving}
          id="skill-save-btn"
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}

function SkillModal({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: SkillModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Sửa kỹ năng" : "Thêm kỹ năng"}
    >
      {open && (
        <SkillModalForm
          key={initial ? `edit-${initial.id}` : "new"}
          initial={initial}
          onClose={onClose}
          onSave={onSave}
          saving={saving}
        />
      )}
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const { groups, loading, saving, create, update, remove, reorderInCategory } =
    useSkills();
  const { setSaveSlot } = useAdminLayout();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SkillResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SkillResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useLayoutEffect(() => {
    setSaveSlot(
      <Button
        size="sm"
        icon={<Plus size={14} />}
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        id="add-skill-btn"
      >
        Thêm kỹ năng
      </Button>,
    );
    return () => setSaveSlot(null);
  }, [setSaveSlot]);

  const handleSave = async (form: SkillRequest) => {
    if (editing) return update(editing.id, form);
    return create(form);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-text-muted text-sm">
              Chưa có kỹ năng nào. Bấm "+ Thêm kỹ năng" để bắt đầu.
            </p>
          </div>
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group.category}>
            <CardHeader
              title={CATEGORY_LABELS[group.category]}
              subtitle={`${group.skills.length} kỹ năng`}
            />
            <SortableList
              items={group.skills}
              onReorder={(skills) =>
                reorderInCategory(skills, group.category)
              }
              renderItem={(skill) => (
                <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 bg-bg group">
                  <i className={`${skill.iconClass} text-xl shrink-0`} />
                  <span className="flex-1 text-sm font-medium text-text-primary">
                    {skill.title}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Pencil size={13} />}
                      onClick={() => {
                        setEditing(skill);
                        setModalOpen(true);
                      }}
                      id={`edit-skill-${skill.id}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={13} />}
                      onClick={() => setDeleteTarget(skill)}
                      id={`delete-skill-${skill.id}`}
                    />
                  </div>
                </div>
              )}
            />
          </Card>
        ))
      )}

      <SkillModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Xóa kỹ năng "${deleteTarget?.title}"?`}
        description="Xóa kỹ năng này có thể ảnh hưởng đến các dự án đang sử dụng nó. Hành động không thể hoàn tác."
      />
    </div>
  );
}
