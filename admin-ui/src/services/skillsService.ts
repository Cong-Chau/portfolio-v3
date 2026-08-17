import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";
import {
  SkillCategory,
  type SkillGroupResponse,
  type SkillRequest,
  type SkillResponse,
  type SkillsResponse,
} from "../types/api";

export const skillsService = {
  list: async (): Promise<SkillGroupResponse[]> => {
    const res = await apiGet<SkillsResponse>("/v1/portfolio/skills");
    const techsGroup: SkillGroupResponse = {
      category: SkillCategory.TECH,
      skills: (res?.techs || []).map((s, idx) => ({
        ...s,
        category: SkillCategory.TECH,
        orderIndex: idx,
      })),
    };
    const toolsGroup: SkillGroupResponse = {
      category: SkillCategory.TOOL,
      skills: (res?.tools || []).map((s, idx) => ({
        ...s,
        category: SkillCategory.TOOL,
        orderIndex: idx,
      })),
    };
    return [techsGroup, toolsGroup];
  },
  create: (data: SkillRequest) =>
    apiPost<SkillResponse>("/v1/admin/skills", data),
  update: (id: number, data: SkillRequest) =>
    apiPut<SkillResponse>(`/v1/admin/skills/${id}`, data),
  remove: (id: number) => apiDelete(`/v1/admin/skills/${id}`),
};
