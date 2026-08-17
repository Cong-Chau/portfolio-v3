"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { PortfolioData } from "@/types/portfolio";
import { fetchPortfolio } from "@/services/portfolioApi";
import { useLanguage } from "./LanguageContext";

interface PortfolioContextProps {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPortfolio(lang);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refetch: load }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx)
    throw new Error("usePortfolio phải được dùng trong PortfolioProvider");
  return ctx;
}
