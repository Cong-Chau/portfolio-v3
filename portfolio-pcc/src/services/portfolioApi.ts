import type { PortfolioData, ApiResponse } from "@/types/portfolio";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

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
