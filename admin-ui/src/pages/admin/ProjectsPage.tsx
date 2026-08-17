import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useAdminLayout } from "../../components/layout/AdminLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import type { AdminProjectResponse } from "../../types/api";
import { Plus, Pencil, Trash2, Link as LinkIcon, Tag } from "lucide-react";

export default function ProjectsPage() {
  const { projects, loading, remove } = useProjects();
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
                <TableRowSkeleton key={i} cols={5} />
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
              {projects.map((project) => (
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
                      <Link to={`/admin/projects/${project.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Pencil size={13} />}
                          id={`edit-project-${project.id}`}
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={13} />}
                        onClick={() => setDeleteTarget(project)}
                        id={`delete-project-${project.id}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Xóa dự án "${deleteTarget?.titleVi}"?`}
        description={`Xóa dự án này sẽ xóa ${deleteTarget?.urls.length ?? 0} liên kết URL đi kèm. Không thể hoàn tác.`}
      />
    </div>
  );
}
