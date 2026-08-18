import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./apiClient";
import type {
  ProjectRequest,
  AdminProjectResponse,
} from "../types/api";

export const projectsService = {
  list: () => apiGet<AdminProjectResponse[]>("/v1/admin/projects"),
  getById: (id: number) =>
    apiGet<AdminProjectResponse>(`/v1/admin/projects/${id}`),
  create: (data: ProjectRequest) =>
    apiPost<AdminProjectResponse>("/v1/admin/projects", data),
  update: (id: number, data: ProjectRequest) =>
    apiPut<AdminProjectResponse>(`/v1/admin/projects/${id}`, data),
  toggleVisibility: (id: number) =>
    apiPatch<AdminProjectResponse>(`/v1/admin/projects/${id}/toggle-visibility`),
  remove: (id: number) => apiDelete(`/v1/admin/projects/${id}`),
};
