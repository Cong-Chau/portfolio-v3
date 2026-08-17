import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";
import type { AboutDetailRequest, AboutDetailResponse } from "../types/api";

export const aboutService = {
  list: async (): Promise<AboutDetailResponse[]> => {
    const [viList, enList] = await Promise.all([
      apiGet<string[]>("/v1/portfolio/about?lang=vi"),
      apiGet<string[]>("/v1/portfolio/about?lang=en"),
    ]);
    const maxLen = Math.max(viList.length, enList.length);
    const result: AboutDetailResponse[] = [];
    for (let i = 0; i < maxLen; i++) {
      result.push({
        id: i + 1,
        contentVi: viList[i] ?? "",
        contentEn: enList[i] ?? "",
        orderIndex: i,
      });
    }
    return result;
  },
  create: (data: AboutDetailRequest) =>
    apiPost<AboutDetailResponse>("/v1/admin/about", data),
  update: (id: number, data: AboutDetailRequest) =>
    apiPut<AboutDetailResponse>(`/v1/admin/about/${id}`, data),
  remove: (id: number) => apiDelete(`/v1/admin/about/${id}`),
};
