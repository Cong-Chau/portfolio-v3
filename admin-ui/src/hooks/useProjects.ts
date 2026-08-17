import { useCallback, useEffect, useState } from "react";
import { projectsService } from "../services/projectsService";
import { skillsService } from "../services/skillsService";
import { useToast } from "../context/ToastContext";
import type { AdminProjectResponse, ProjectRequest } from "../types/api";

export function useProjects() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<AdminProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const skillGroups = await skillsService.list();
      const allSkills = skillGroups.flatMap((g) => g.skills);
      const data = await projectsService.list(allSkills);
      setProjects(data.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Không tải được dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetch();
  }, [fetch]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const skillGroups = await skillsService.list();
        const allSkills = skillGroups.flatMap((g) => g.skills);
        const data = await projectsService.list(allSkills);
        if (!ignore) {
          setProjects(data.sort((a, b) => a.orderIndex - b.orderIndex));
        }
      } catch (err) {
        if (!ignore) {
          addToast(
            err instanceof Error ? err.message : "Không tải được dữ liệu",
            "error",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [addToast]);

  const create = async (payload: ProjectRequest) => {
    setSaving(true);
    try {
      const res = await projectsService.create(payload);
      addToast("Đã tạo dự án thành công", "success");
      setProjects((prev) => [...prev, res]);
      return res;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Tạo dự án thất bại", "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, payload: ProjectRequest) => {
    setSaving(true);
    try {
      const res = await projectsService.update(id, payload);
      addToast("Đã cập nhật dự án", "success");
      setProjects((prev) => prev.map((p) => (p.id === id ? res : p)));
      return res;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Cập nhật thất bại", "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await projectsService.remove(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      addToast("Đã xóa dự án", "success");
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Xóa thất bại", "error");
      return false;
    }
  };

  const getById = (id: number) => projects.find((p) => p.id === id) ?? null;

  return { projects, loading, saving, create, update, remove, getById, refetch };
}
