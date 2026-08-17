import React, { useState } from "react";
import type { Lang } from "../types/api";
import { LanguageContext } from "./LanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Lang>("vi");
  const toggle = () => setLang((l) => (l === "vi" ? "en" : "vi"));
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
};
