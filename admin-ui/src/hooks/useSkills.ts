import { useCallback, useEffect, useState } from "react";
import { skillsService } from "../services/skillsService";
import { useToast } from "../context/ToastContext";
import { SkillCategory, type SkillGroupResponse, type SkillRequest, type SkillResponse } from "../types/api";

export function useSkills() {
  const { addToast } = useToast();
  const [groups, setGroups] = useState<SkillGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await skillsService.list();
      setGroups(data);
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Không tải được dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Flat list of all skills (for SkillTagPicker)
  const allSkills: SkillResponse[] = groups.flatMap((g) => g.skills);

  const create = async (payload: SkillRequest) => {
    setSaving(true);
    try {
      await skillsService.create(payload);
      addToast("Đã thêm kỹ năng", "success");
      await fetch();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Thêm thất bại", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, payload: SkillRequest) => {
    setSaving(true);
    try {
      await skillsService.update(id, payload);
      addToast("Đã cập nhật kỹ năng", "success");
      await fetch();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Cập nhật thất bại", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await skillsService.remove(id);
      addToast("Đã xóa kỹ năng", "success");
      await fetch();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Xóa thất bại", "error");
    }
  };

  const reorderInCategory = async (
    categorySkills: SkillResponse[],
    category: SkillCategory,
  ) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.category === category ? { ...g, skills: categorySkills } : g,
      ),
    );
    for (let i = 0; i < categorySkills.length; i++) {
      const skill = categorySkills[i];
      try {
        await skillsService.update(skill.id, {
          title: skill.title,
          iconClass: skill.iconClass,
          category: category,
          orderIndex: i,
        });
      } catch {
        // Silently ignore
      }
    }
  };

  return { groups, allSkills, loading, saving, create, update, remove, reorderInCategory, refetch: fetch };
}
