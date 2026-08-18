"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = useQuery<PortfolioData | null, Error>({
    queryKey: ["portfolio", lang],
    queryFn: async () => {
      try {
        return await fetchPortfolio(lang);
      } catch (err) {
        console.warn("Lỗi khi tải dữ liệu portfolio:", err);
        return null;
      }
    },
  });

  return (
    <PortfolioContext.Provider
      value={{
        data: data ?? null,
        loading: isLoading,
        error: error ? error.message : null,
        refetch: async () => {
          await refetch();
        },
      }}
    >
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
