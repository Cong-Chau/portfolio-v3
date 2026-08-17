import { apiGet, apiPut } from "./apiClient";
import type {
  PersonalInfoRequest,
  PersonalInfoResponse,
} from "../types/api";

export const personalService = {
  get: async (): Promise<PersonalInfoRequest> => {
    const [vi, en] = await Promise.all([
      apiGet<PersonalInfoResponse>("/v1/portfolio/personal?lang=vi"),
      apiGet<PersonalInfoResponse>("/v1/portfolio/personal?lang=en"),
    ]);
    return {
      name: vi.name ?? en.name ?? "",
      titleVi: vi.title ?? "",
      titleEn: en.title ?? "",
      summaryVi: vi.summary ?? "",
      summaryEn: en.summary ?? "",
      email: vi.email ?? en.email ?? "",
      phone: vi.phone ?? en.phone ?? "",
      locationVi: vi.location ?? "",
      locationEn: en.location ?? "",
      linkedinUrl: vi.linkedinUrl ?? en.linkedinUrl ?? "",
      githubUrl: vi.githubUrl ?? en.githubUrl ?? "",
      avatarUrl: vi.avatarUrl ?? en.avatarUrl ?? "",
      cvUrl: vi.cvUrl ?? en.cvUrl ?? "",
    };
  },
  update: (data: PersonalInfoRequest) =>
    apiPut<PersonalInfoResponse>("/v1/admin/personal", data),
};
