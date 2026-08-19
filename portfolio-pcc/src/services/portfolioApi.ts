import type { PortfolioData, ApiResponse } from "@/types/portfolio";

function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) return "http://localhost:8080/api";
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  if (!url.endsWith("/api")) {
    url = `${url.replace(/\/+$/, "")}/api`;
  }
  return url;
}

const BASE_URL = getApiBaseUrl();

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  const json: ApiResponse<T> = await res.json();
  return json.result;
}

export async function fetchPortfolio(lang: string): Promise<PortfolioData> {
  return fetchApi<PortfolioData>(`/v1/portfolio?lang=${lang}`);
}
