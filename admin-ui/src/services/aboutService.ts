import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";
import type { AboutDetailRequest, AboutDetailResponse } from "../types/api";

export const aboutService = {
  list: () => apiGet<AboutDetailResponse[]>("/v1/admin/about"),
  create: (data: AboutDetailRequest) =>
    apiPost<AboutDetailResponse>("/v1/admin/about", data),
  update: (id: number, data: AboutDetailRequest) =>
    apiPut<AboutDetailResponse>(`/v1/admin/about/${id}`, data),
  remove: (id: number) => apiDelete(`/v1/admin/about/${id}`),
};
