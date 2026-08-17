"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";

const CVPreview = dynamic(() => import("../cards/CVPreview"), {
  ssr: false,
});

function About() {
  const { t } = useLanguage();
  const { data } = usePortfolio();

  const aboutMes = data?.aboutMes || [];
  const avatarUrl = data?.personal?.avatarUrl || "/images/avatar.jpg";
  const aboutTitle = data?.personal?.summary || "";

  return (
    <div
      id="about"
      className="w-full flex flex-col items-center justify-start gap-4 text-white mb-8 scroll-mt-20"
    >
      <p className="w-full text-center font-bold pb-4 text-5xl md:text-7xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        {t("about.header")}
      </p>
      {aboutTitle && (
        <p className="text-center w-4/5 md:w-2/5 text-white">
          {aboutTitle}
        </p>
      )}
      <div className="flex flex-row w-4/5 justify-center gap-8 mt-8 ">
        <div className="w-full md:w-2/5 flex flex-col items-center gap-4 rounded-full">
          {/* avatar */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 rounded-full bg-white blur-sm"></div>
            <Tilt
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              perspective={1000}
              scale={1}
              transitionSpeed={1000}
              gyroscope={true}
            >
              <motion.img
                initial={{ opacity: 0, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.05 }}
                viewport={{ once: false, amount: 0.1 }}
                className="relative w-full h-full object-cover rounded-full cursor-target"
                src={avatarUrl}
                alt="About Me"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/avatar.jpg";
                }}
              />
            </Tilt>
          </div>

          {/* Scrambled text */}
          {aboutMes.map((line, i) => (
            <span key={i}>
              {line}
              <br />
              <br />
            </span>
          ))}
        </div>

        {/* CV Preview */}
        <div className="hidden md:block w-auto relative ml-8">
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={2000}
            scale={1}
            transitionSpeed={1000}
            gyroscope={true}
          >
            <CVPreview />
          </Tilt>
        </div>
      </div>
    </div>
  );
}

export default About;
