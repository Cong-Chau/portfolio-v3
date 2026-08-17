import { useEffect, useLayoutEffect, useState } from "react";
import { useAbout } from "../../hooks/useAbout";
import { useAdminLayout } from "../../components/layout/AdminLayoutContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import { Input } from "../../components/ui/Input";
import { Drawer } from "../../components/common/Drawer";
import { SortableList } from "../../components/common/SortableList";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { AboutDetailRequest, AboutDetailResponse } from "../../types/api";
import { Plus, Trash2, Pencil } from "lucide-react";

// ─── Drawer Form ─────────────────────────────────────────────────────────────
type AboutForm = AboutDetailRequest;
type AboutErrors = Partial<Record<keyof AboutForm, string>>;

function validateAbout(f: AboutForm): AboutErrors {
  const e: AboutErrors = {};
  if (!f.contentVi.trim()) e.contentVi = "Bắt buộc";
  if (!f.contentEn.trim()) e.contentEn = "Bắt buộc";
  if (f.orderIndex < 0) e.orderIndex = "Phải >= 0";
  return e;
}

interface AboutDrawerProps {
  open: boolean;
  onClose: () => void;
  initial?: AboutDetailResponse | null;
  onSave: (form: AboutForm) => Promise<boolean>;
  saving: boolean;
}

interface AboutDrawerFormProps {
  initial?: AboutDetailResponse | null;
  onSave: (form: AboutForm) => Promise<boolean>;
  saving: boolean;
  onClose: () => void;
}

function AboutDrawerForm({
  initial,
  onSave,
  saving,
  onClose,
}: AboutDrawerFormProps) {
  const [form, setForm] = useState<AboutForm>(() =>
    initial
      ? {
          contentVi: initial.contentVi,
          contentEn: initial.contentEn,
          orderIndex: initial.orderIndex,
        }
      : { contentVi: "", contentEn: "", orderIndex: 0 },
  );
  const [errors, setErrors] = useState<AboutErrors>({});

  const set = <K extends keyof AboutForm>(k: K, v: AboutForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateAbout(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const ok = await onSave(form);
    if (ok) onClose();
  };

  return (
    <div className="space-y-5">
      <Textarea
        label="Nội dung (VI)"
        value={form.contentVi}
        onChange={(e) => set("contentVi", e.target.value)}
        required
        error={errors.contentVi}
        rows={5}
        id="about-content-vi"
      />
      <Textarea
        label="Content (EN)"
        value={form.contentEn}
        onChange={(e) => set("contentEn", e.target.value)}
        required
        error={errors.contentEn}
        rows={5}
        id="about-content-en"
      />
      <Input
        label="Thứ tự"
        type="number"
        value={String(form.orderIndex)}
        onChange={(e) => set("orderIndex", parseInt(e.target.value) || 0)}
        error={errors.orderIndex}
        id="about-order"
      />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Hủy
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          loading={saving}
          id="about-save-btn"
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}

function AboutDrawer({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: AboutDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={initial ? "Sửa giới thiệu" : "Thêm giới thiệu"}
    >
      {open && (
        <AboutDrawerForm
          key={initial ? `edit-${initial.id}` : "new"}
          initial={initial}
          onClose={onClose}
          onSave={onSave}
          saving={saving}
        />
      )}
    </Drawer>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
interface AboutCardProps {
  item: AboutDetailResponse;
  onEdit: () => void;
  onDelete: () => void;
}

function AboutCard({ item, onEdit, onDelete }: AboutCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  return (
    <Card className="group relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary leading-relaxed line-clamp-3">
            {item.contentVi}
          </p>
          <p className="mt-1 text-xs text-text-muted line-clamp-2">
            {item.contentEn}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={onEdit}
            id={`edit-about-${item.id}`}
          />
          {confirmDelete ? (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              id={`confirm-delete-about-${item.id}`}
            >
              Xác nhận xóa?
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 size={13} />}
              onClick={() => setConfirmDelete(true)}
              id={`delete-about-${item.id}`}
            />
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-text-muted">#{item.orderIndex}</span>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { items, loading, saving, create, update, remove, reorder } = useAbout();
  const { setSaveSlot } = useAdminLayout();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<AboutDetailResponse | null>(null);

  useLayoutEffect(() => {
    setSaveSlot(
      <Button
        size="sm"
        icon={<Plus size={14} />}
        onClick={() => {
          setEditing(null);
          setDrawerOpen(true);
        }}
        id="add-about-btn"
      >
        Thêm giới thiệu
      </Button>,
    );
    return () => setSaveSlot(null);
  }, [setSaveSlot]);

  const handleSave = async (form: AboutDetailRequest) => {
    if (editing) return update(editing.id, form);
    return create(form);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      {items.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-text-muted text-sm">
              Chưa có giới thiệu nào. Bấm "+ Thêm giới thiệu" để bắt đầu.
            </p>
          </div>
        </Card>
      ) : (
        <SortableList
          items={items}
          onReorder={reorder}
          renderItem={(item) => (
            <AboutCard
              item={item}
              onEdit={() => {
                setEditing(item);
                setDrawerOpen(true);
              }}
              onDelete={() => remove(item.id)}
            />
          )}
        />
      )}

      <AboutDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
