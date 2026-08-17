import { createContext, useContext } from "react";
import type { Lang } from "../types/api";

export interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "vi",
  toggle: () => {},
});

export const useLang = () => useContext(LanguageContext);
