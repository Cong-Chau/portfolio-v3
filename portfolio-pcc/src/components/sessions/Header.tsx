"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";

function Header() {
  const { t, lang, setLang } = useLanguage();
  const { data } = usePortfolio();
  const nav = t("header.nav");
  const displayName = data?.personal?.name ? data.personal.name.toUpperCase() : t("header.name");

  return (
    <header
      className={`fixed top-0 left-0 w-full h-20 z-50 flex flex-row gap-4 justify-between px-4 py-2 md:px-8 md:py-4 text-white`}
    >
      <div className={`flex flex-row md:gap-4 items-center`}>
        <p className={`font-bold `}>{displayName}</p>
        <nav
          className={`hidden md:flex flex-row gap-2 text-center bg-white/12 rounded-[8px] p-1 backdrop-blur-sm`}
        >
          <a
            href="#home"
            className="hover:bg-white/24 duration-200 m-1 p-1 px-2 rounded-[4px] font-semibold cursor-target"
          >
            {nav[0]}
          </a>
          <a
            href="#about"
            className="hover:bg-white/24 duration-200 m-1 p-1 px-2 rounded-[4px] font-semibold cursor-target"
          >
            {nav[1]}
          </a>
          <a
            href="#skills"
            className="hover:bg-white/24 duration-200 m-1 p-1 px-2 rounded-[4px] font-semibold cursor-target"
          >
            {nav[2]}
          </a>
          <a
            href="#projects"
            className="hover:bg-white/24 duration-200 m-1 p-1 px-2 rounded-[4px] font-semibold cursor-target"
          >
            {nav[3]}
          </a>
          <a
            href="#contact"
            className="hover:bg-white/24 duration-200 m-1 p-1 px-2 rounded-[4px] font-semibold cursor-target"
          >
            {nav[4]}
          </a>
        </nav>
      </div>
      <div className="flex flex-row gap-4 items-center">
        {/* Language Toggle */}
        <div
          role="group"
          aria-label="Language selector"
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="cursor-target relative flex items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15 cursor-pointer select-none h-10 w-24"
        >
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
            animate={{
              left: lang === "vi" ? "4px" : "calc(50%)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLang("vi");
            }}
            className={`relative z-10 w-1/2 text-center text-xs font-bold transition-colors duration-200 ${
              lang === "vi" ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            VI
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLang("en");
            }}
            className={`relative z-10 w-1/2 text-center text-xs font-bold transition-colors duration-200 ${
              lang === "en" ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
