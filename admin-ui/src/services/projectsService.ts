import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";
import type {
  ProjectRequest,
  AdminProjectResponse,
  ProjectResponse,
  SkillResponse,
  ProjectUrl,
} from "../types/api";

export const projectsService = {
  list: async (allSkills: SkillResponse[] = []): Promise<AdminProjectResponse[]> => {
    const [viList, enList] = await Promise.all([
      apiGet<ProjectResponse[]>("/v1/portfolio/projects?lang=vi"),
      apiGet<ProjectResponse[]>("/v1/portfolio/projects?lang=en"),
    ]);

    const skillMap = new Map<string, SkillResponse>();
    allSkills.forEach((s) => skillMap.set(s.title.toLowerCase(), s));

    return viList.map((vi, index) => {
      const en = enList.find((p) => p.id === vi.id) ?? enList[index] ?? vi;

      const projectSkills: SkillResponse[] = (vi.skills || []).map((skillName) => {
        const match = skillMap.get(skillName.toLowerCase());
        return match || { id: 0, title: skillName, iconClass: "" };
      });

      const urls: ProjectUrl[] = (vi.urls || []).map((u, uIdx) => {
        const enUrl = en.urls?.[uIdx];
        return {
          labelVi: u.label,
          labelEn: enUrl?.label || u.label,
          url: u.url,
        };
      });

      return {
        id: vi.id,
        titleVi: vi.title,
        titleEn: en.title,
        completeTimeVi: vi.completeTime,
        completeTimeEn: en.completeTime,
        descriptionVi: vi.description,
        descriptionEn: en.description,
        highlightVi: vi.highlight,
        highlightEn: en.highlight,
        orderIndex: index,
        skills: projectSkills,
        urls: urls,
      };
    });
  },
  create: (data: ProjectRequest) =>
    apiPost<AdminProjectResponse>("/v1/admin/projects", data),
  update: (id: number, data: ProjectRequest) =>
    apiPut<AdminProjectResponse>(`/v1/admin/projects/${id}`, data),
  remove: (id: number) => apiDelete(`/v1/admin/projects/${id}`),
};
