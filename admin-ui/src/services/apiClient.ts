import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return "http://localhost:8080/api";

  let url = envUrl.trim();

  // If it's local development
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }
    return url.endsWith("/api") ? url : `${url.replace(/\/+$/, "")}/api`;
  }

  // Strip protocol to analyze hostname
  const raw = url.replace(/^https?:\/\//, "");
  const slashIdx = raw.indexOf("/");
  let host = slashIdx !== -1 ? raw.substring(0, slashIdx) : raw;
  let path = slashIdx !== -1 ? raw.substring(slashIdx) : "";

  // If Render passed an internal service name without domain suffix (e.g. portfolio-server-u3bk)
  if (!host.includes(".")) {
    host = `${host}.onrender.com`;
  }

  // Ensure path ends with /api
  if (!path || path === "/") {
    path = "/api";
  } else if (!path.endsWith("/api")) {
    path = `${path.replace(/\/+$/, "")}/api`;
  }

  return `https://${host}${path}`;
}

const BASE_URL = getApiBaseUrl();
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

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiClient.patch<ApiResponse<T>>(url, body);
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
