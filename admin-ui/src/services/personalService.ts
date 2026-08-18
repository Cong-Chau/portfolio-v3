import { apiGet, apiPut, apiUpload } from "./apiClient";
import type {
  PersonalInfoRequest,
  PersonalInfoResponse,
  UploadCvResponse,
  UploadImageResponse,
} from "../types/api";

export const personalService = {
  get: () => apiGet<PersonalInfoRequest>("/v1/admin/personal"),
  update: (data: PersonalInfoRequest) =>
    apiPut<PersonalInfoResponse>("/v1/admin/personal", data),
  uploadCv: (file: File) =>
    apiUpload<UploadCvResponse>("/v1/admin/cv/upload", file),
  uploadAvatar: (file: File) =>
    apiUpload<UploadImageResponse>("/v1/admin/avatar/upload", file),
};
