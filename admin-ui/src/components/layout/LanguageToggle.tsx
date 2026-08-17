import React from "react";
import { useLang } from "../../context/LanguageContext";
import type { Lang } from "../../types/api";

export const LanguageToggle: React.FC = () => {
  const { lang, toggle } = useLang();

  const options: Lang[] = ["vi", "en"];

  return (
    <button
      onClick={toggle}
      className="flex items-center rounded-full border border-border bg-surface p-0.5 text-xs font-semibold transition-colors"
      title="Toggle language"
      id="language-toggle"
    >
      {options.map((l) => (
        <span
          key={l}
          className={[
            "flex h-6 w-8 items-center justify-center rounded-full transition-all duration-200",
            lang === l
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text-secondary",
          ].join(" ")}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </button>
  );
};
