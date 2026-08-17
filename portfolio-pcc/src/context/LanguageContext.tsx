"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "../../public/locales/en/common.json";
import vi from "../../public/locales/vi/common.json";

// Kiểu dữ liệu ngôn ngữ
export type Languages = "en" | "vi";

// Kiểu dữ liệu context
interface LanguageContextProps {
  lang: Languages;
  setLang: (lang: Languages) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Languages>("vi");

  const translations: Record<Languages, any> = { en, vi };

  // Hàm lấy translation từ JSON
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook để dùng trong component
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage phải được dùng trong LanguageProvider");
  }
  return context;
};
