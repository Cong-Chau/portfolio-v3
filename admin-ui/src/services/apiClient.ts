import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";

// ─── Constants ───────────────────────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const TOKEN_KEY = "admin_token";

// ─── Axios instance ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ─── Request interceptor: attach token ───────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: unwrap ApiResponse<T> ────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    // Return the whole response — callers can access .data
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Đã xảy ra lỗi không xác định";
    return Promise.reject(new Error(message));
  },
);

// ─── Token helpers ────────────────────────────────────────────────────────────
export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// ─── Typed helper to extract data from ApiResponse<T> ────────────────────────
export async function apiGet<T>(url: string): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url);
  return res.data.result;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await apiClient.post<ApiResponse<T>>(url, body);
  return res.data.result;
}

export async function apiPut<T>(url: string, body: unknown): Promise<T> {
  const res = await apiClient.put<ApiResponse<T>>(url, body);
  return res.data.result;
}

export async function apiDelete(url: string): Promise<void> {
  await apiClient.delete(url);
}

export async function apiUpload<T>(url: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.result;
}

export default apiClient;
