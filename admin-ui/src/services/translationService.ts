import { apiPost } from "./apiClient";
import type { TranslateRequest, TranslateResponse } from "../types/api";

export const translationService = {
  translate: (data: TranslateRequest) =>
    apiPost<TranslateResponse>("/v1/admin/translate", data),
};
