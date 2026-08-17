"use client";
import { Github, Globe, ExternalLink } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";

function getUrlIcon(label: string, url: string) {
  const lowerLabel = label.toLowerCase();
  const lowerUrl = url.toLowerCase();
  if (lowerLabel.includes("github") || lowerUrl.includes("github.com")) {
    return <Github className="w-4 h-4" />;
  }
  if (
    lowerLabel.includes("demo") ||
    lowerLabel.includes("live") ||
    lowerLabel.includes("web")
  ) {
    return <Globe className="w-4 h-4" />;
  }
  return <ExternalLink className="w-4 h-4" />;
}

function Projects() {
  const { t } = useLanguage();
  const { data } = usePortfolio();

  const projects = data?.projects || [];

  return (
    <div
      id="projects"
      className="w-full flex flex-col items-center justify-start gap-4 text-white my-28 scroll-mt-20 min-h-screen"
    >
      <p className="w-full pb-3 text-center font-bold text-5xl md:text-7xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        {t("projects.header")}
      </p>
      <p className="text-center w-4/5 md:w-2/5 text-white">
        {t("projects.title")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-4/5 mx-auto mt-6">
        {projects.map((project, index) => (
          <Tilt
            key={project.id || index}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            perspective={5000}
            scale={1}
            transitionSpeed={1000}
            gyroscope={true}
            className="h-full"
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
              key={index}
              className="h-full text-center bg-white/12 hover:bg-white/8 
                    rounded-[8px] p-6 backdrop-blur-[4px] 
                    flex flex-col items-center justify-between"
            >
              <div className="w-full">
                <h1 className="w-full text-left font-bold text-blue-500 text-xl">
                  {project.title}
                </h1>
                <p className="w-full text-left font-semibold">
                  {project.completeTime}
                </p>
                <div className="border border-b border-gray-500 my-3"></div>
                <p className="w-full text-left text-gray-300">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(project.skills || []).map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="cursor-target hover:cursor-pointer hover:bg-blue-400/24 transition-transform
                            flex justify-center items-center rounded-full border border-accent/20 text-white py-1 px-3"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <div className="border border-b border-gray-500 my-3"></div>
                <p className="w-full text-left text-gray-300">
                  {project.highlight}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {(project.urls || []).map((link, urlIndex) => (
                    <a
                      key={urlIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                            bg-accent/10 text-accent border border-accent/20 rounded-lg 
                            hover:scale-105 hover:bg-white hover:text-black
                            transition-all duration-200"
                    >
                      {getUrlIcon(link.label, link.url)}
                      {link.label || "Link"}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}

export default Projects;
