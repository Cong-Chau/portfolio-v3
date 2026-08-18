import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";
import {
  SkillCategory,
  type SkillGroupResponse,
  type SkillRequest,
  type SkillResponse,
} from "../types/api";

export const skillsService = {
  list: async (): Promise<SkillGroupResponse[]> => {
    const all = await apiGet<SkillResponse[]>("/v1/admin/skills");
    const techs = (all || [])
      .filter((s) => s.category === SkillCategory.TECH)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const tools = (all || [])
      .filter((s) => s.category === SkillCategory.TOOL)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    return [
      { category: SkillCategory.TECH, skills: techs },
      { category: SkillCategory.TOOL, skills: tools },
    ];
  },
  create: (data: SkillRequest) =>
    apiPost<SkillResponse>("/v1/admin/skills", data),
  update: (id: number, data: SkillRequest) =>
    apiPut<SkillResponse>(`/v1/admin/skills/${id}`, data),
  remove: (id: number) => apiDelete(`/v1/admin/skills/${id}`),
};
