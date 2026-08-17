"use client";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";

function Skills() {
  const { t } = useLanguage();
  const { data } = usePortfolio();

  const techs = data?.skills?.techs || [];
  const tools = data?.skills?.tools || [];

  return (
    <div
      id="skills"
      className="w-full flex flex-col items-center justify-start gap-4 text-white my-28 scroll-mt-20 "
    >
      <p className="w-full text-center pb-4 font-bold text-5xl md:text-7xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        {t("skills.header")}
      </p>
      <p className="text-center w-4/5 md:w-2/5 text-white">
        {t("skills.title")}
      </p>

      {/* Công nghệ */}
      {techs.length > 0 && (
        <div className="w-2/3 md:w-1/2">
          <motion.p
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center bg-white/12 rounded-[8px] px-4 py-2 backdrop-blur-sm font-semibold mt-4 w-full mx-auto"
          >
            {t("skills.techs")}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full mx-auto mt-6">
            {techs.map((tech, index) => (
              <Tilt
                key={tech.id || index}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1}
                transitionSpeed={1000}
                gyroscope={true}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.05,
                  }}
                  viewport={{ once: false, amount: 0.1 }}
                  className="cursor-target text-center bg-white/12 hover:bg-white/8 rounded-[8px] p-4 backdrop-blur-[4px] flex flex-col items-center"
                >
                  <div className="w-1/2 flex justify-center">
                    <i
                      className={`${tech.iconClass} text-5xl md:text-[64px]`}
                    ></i>
                  </div>
                  <p className="mt-2">{tech.title}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      )}

      {/* Công cụ */}
      {tools.length > 0 && (
        <div className="w-2/3 md:w-1/2">
          <motion.p
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center bg-white/12 rounded-[8px] px-4 py-2 backdrop-blur-sm font-semibold mt-4 w-full mx-auto"
          >
            {t("skills.tools")}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full mx-auto mt-6">
            {tools.map((tool, index) => (
              <Tilt
                key={tool.id || index}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1}
                transitionSpeed={1000}
                gyroscope={true}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.05,
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="cursor-target text-center bg-white/12 hover:bg-white/8 rounded-[8px] p-4 backdrop-blur-[4px] flex flex-col items-center"
                >
                  <div className="w-1/2 flex justify-center">
                    <i
                      className={`${tool.iconClass} text-5xl md:text-[64px]`}
                    ></i>
                  </div>
                  <p className="mt-2">{tool.title}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Skills;
