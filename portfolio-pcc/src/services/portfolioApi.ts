import type { PortfolioData, ApiResponse } from "@/types/portfolio";

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
