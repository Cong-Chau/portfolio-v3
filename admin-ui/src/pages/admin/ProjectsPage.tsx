import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useAdminLayout } from "../../components/layout/AdminLayoutContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import type { AdminProjectResponse } from "../../types/api";
import { Plus, Pencil, Trash2, Link as LinkIcon, Tag, Eye, EyeOff } from "lucide-react";

export default function ProjectsPage() {
  const { projects, loading, toggleVisibility, remove } = useProjects();
  const { setSaveSlot } = useAdminLayout();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectResponse | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  useLayoutEffect(() => {
    setSaveSlot(
      <Button
        size="sm"
        icon={<Plus size={14} />}
        onClick={() => navigate("/admin/projects/new")}
        id="add-project-btn"
      >
        Dự án mới
      </Button>,
    );
    return () => setSaveSlot(null);
  }, [setSaveSlot, navigate]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <Card padding="none">
        {loading ? (
          <table className="w-full">
            <tbody>
              {[1, 2, 3].map((i) => (
                <TableRowSkeleton key={i} cols={6} />
              ))}
            </tbody>
          </table>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-text-muted text-sm">
              Chưa có dự án nào. Bấm "+ Dự án mới" để bắt đầu.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Tên dự án
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Skills
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Links
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const isVisible = project.isVisible !== false;
                return (
                  <tr
                    key={project.id}
                    className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {project.titleVi}
                        </p>
                        <p className="text-xs text-text-muted">
                          {project.titleEn}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-text-secondary">
                        {project.completeTimeVi}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(project.id)}
                        className="cursor-pointer inline-flex items-center transition-transform hover:scale-105"
                        title={
                          isVisible
                            ? "Bấm để ẩn dự án khỏi portfolio"
                            : "Bấm để hiển thị dự án lên portfolio"
                        }
                        id={`toggle-visibility-${project.id}`}
                      >
                        {isVisible ? (
                          <Badge variant="success" className="gap-1 cursor-pointer">
                            <Eye size={11} />
                            Hiển thị
                          </Badge>
                        ) : (
                          <Badge variant="muted" className="gap-1 cursor-pointer opacity-70">
                            <EyeOff size={11} />
                            Đã ẩn
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant="muted">
                        <Tag size={10} className="mr-1 inline" />
                        {project.skills.length}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant="muted">
                        <LinkIcon size={10} className="mr-1 inline" />
                        {project.urls.length}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                          onClick={() => toggleVisibility(project.id)}
                          title={isVisible ? "Ẩn dự án" : "Hiện dự án"}
                          id={`btn-visibility-action-${project.id}`}
                        />
                        <Link to={`/admin/projects/${project.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Pencil size={13} />}
                            title="Chỉnh sửa dự án"
                            id={`edit-project-${project.id}`}
                          />
                        </Link>
                        {isVisible && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 size={13} />}
                            onClick={() => setDeleteTarget(project)}
                            title="Ẩn khỏi portfolio"
                            id={`delete-project-${project.id}`}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Ẩn dự án "${deleteTarget?.titleVi}"?`}
        description="Dự án này sẽ không còn hiển thị trên Portfolio công khai. Bạn có thể bật hiển thị lại bất cứ lúc nào trong trang Quản trị."
      />
    </div>
  );
}
