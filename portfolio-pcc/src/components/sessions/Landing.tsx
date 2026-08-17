"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import TextType from "../cards/TextType";
import Shuffle from "../cards/Shuffle";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { sendMail } from "@/utils/sendMail";
import { callPhone } from "@/utils/callPhone";
import { openLink } from "@/utils/openLink";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
} from "lucide-react";

interface Bubble {
  icon: React.ReactNode;
  text: string;
  action?: () => void;
}

function Landing() {
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const { t, lang } = useLanguage();
  const { data } = usePortfolio();
  const personal = data?.personal;

  const landingTitle = useMemo(() => {
    if (personal?.name) {
      return [
        lang === "vi"
          ? `Xin chào, tôi là ${personal.name}`
          : `Hello, I'm ${personal.name}`,
      ];
    }
    return [t("landing.title")];
  }, [personal?.name, lang, t]);

  const titleParts = useMemo(() => {
    const raw = personal?.title?.trim() || "Fullstack Developer";
    const words = raw.split(/\s+/);

    if (words.length > 3) {
      return {
        firstPart: words.slice(0, -3).join(" "),
        lastPart: words.slice(-3).join(" "),
      };
    }
    if (words.length > 1) {
      return {
        firstPart: words.slice(0, -1).join(" "),
        lastPart: words[words.length - 1],
      };
    }
    return {
      firstPart: raw,
      lastPart: "",
    };
  }, [personal?.title]);

  const landingSummary = useMemo(() => {
    if (personal?.summary) {
      return [personal.summary];
    }
    return [t("landing.sumary")];
  }, [personal?.summary, t]);

  const bubbles: Bubble[] = useMemo(() => {
    const email = personal?.email || "congchau206@gmail.com";
    const phone = personal?.phone || "0703913350";
    const github = personal?.githubUrl || "https://github.com/Cong-Chau";
    const linkedin =
      personal?.linkedinUrl || "https://www.linkedin.com/in/congchau20604/";
    const location =
      personal?.location ||
      (lang === "vi" ? "TP Hồ Chí Minh" : "Ho Chi Minh City");

    const githubHandle = github.replace(/^https?:\/\/github\.com\/?/, "@");
    const linkedinHandle = linkedin
      .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, "@")
      .replace(/\/$/, "");

    return [
      {
        icon: <Mail />,
        text: `Email: ${email}`,
        action: () => sendMail(email),
      },
      {
        icon: <PhoneCall />,
        text: `Phone: ${phone}`,
        action: () => callPhone(phone),
      },
      {
        icon: <Github />,
        text: `Github: ${githubHandle}`,
        action: () => openLink(github),
      },
      {
        icon: <Linkedin />,
        text: `LinkedIn: ${linkedinHandle}`,
        action: () => openLink(linkedin),
      },
      {
        icon: <MapPin />,
        text: `Location: ${location}`,
        action: () =>
          openLink(
            `https://www.google.com/maps?q=${encodeURIComponent(location)}`,
          ),
      },
    ];
  }, [personal, lang]);

  const handleDownload = () => {
    const cvUrl =
      personal?.cvUrl ||
      "https://www.dropbox.com/scl/fi/hli1mq9yy1fhuohja83jp/PhanCongChau_CV_FullStack_Intern.pdf?rlkey=18vm3zej7fi7do8u0uqv5zcuv&st=zqyrrzq7&dl=1";
    window.open(cvUrl, "_blank");
  };

  return (
    <div
      id="home"
      className={`text-white w-full flex flex-col md:flex-row md:justify-between scroll-mt-20 pb-12
        pt-12 pl-4 pr-4
        lg:pt-12 lg:pl-20 lg:pr-12
        2xl:pt-24 2xl:pl-48 2xl:pr-36`}
    >
      <div className="flex flex-col gap-4 w-full md:w-1/2">
        <div className="relative w-fit h-fit min-h-8">
          <div className={`z-10 font-semibold text-xl inline-block `}>
            <TextType
              text={landingTitle}
              typingSpeed={40}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="_"
            />
          </div>
        </div>
        <motion.span
          key={titleParts.firstPart}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
          className="font-bold text-[1.15rem] min-[360px]:text-[1.35rem] min-[420px]:text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl whitespace-nowrap"
        >
          {titleParts.firstPart}
        </motion.span>
        {titleParts.lastPart && (
          <div className="whitespace-nowrap w-full overflow-visible">
            <Shuffle
              key={titleParts.lastPart}
              text={titleParts.lastPart}
              className="whitespace-nowrap text-[1.15rem] min-[360px]:text-[1.35rem] min-[420px]:text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
          </div>
        )}
        <div className="w-4/5 min-h-32 md:min-h-24">
          <TextType
            text={landingSummary}
            typingSpeed={1}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="_"
          />
        </div>
        {/* Button */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: false, amount: 0.5 }}
          className=" relative w-auto h-auto md:mt-4 "
        >
          <button
            onClick={handleDownload}
            className="cursor-target relative z-10 bg-white text-black font-semibold py-2 px-4 rounded-[12px] border border-white hover:bg-transparent hover:text-white hover:cursor-pointer transition-all duration-200 flex flex-row items-center gap-2 shadow-sm"
          >
            <p>{t("landing.CV")}</p> <Download size={18} />
          </button>
        </motion.div>
        {/* Icon */}
        <div className="hidden md:flex flex-row w-full min-h-10 justify-start gap-6 mt-8">
          {bubbles.map((bubble, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                delay: index * 0.15,
              }}
              viewport={{ once: false, amount: 0.5 }}
              onMouseEnter={() => {
                setHoverText(bubble.text);
              }}
              onMouseLeave={() => setHoverText(null)}
              onMouseMove={(e) => {
                setCursorPos({ x: e.clientX, y: e.clientY });
              }}
              onClick={bubble.action}
              className={`cursor-target hover:cursor-pointer hover:scale-110 hover:bg-white/24 transition-transform w-10 h-10 
                flex justify-center items-center rounded-[8px] bg-white/20 text-white`}
            >
              {bubble.icon}
            </motion.div>
          ))}
        </div>
        {/* Con trỏ text hover */}
        {hoverText && (
          <div
            className="fixed pointer-events-none bg-white text-black text-sm px-2 py-1 rounded shadow-lg z-50"
            style={{
              left: cursorPos.x + 15,
              top: cursorPos.y + 15,
            }}
          >
            {hoverText}
          </div>
        )}
      </div>
      <div className="relative w-[717px] h-[347px] mt-12 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
        >
          <DotLottieReact
            src="/gifs/Technology.lottie"
            className="lg:w-full lg:h-full mb-14"
            loop
            autoplay
          />
        </motion.div>
      </div>
      {/* Mobile */}
      <div className="w-full mt-12 flex flex-col gap-4 md:hidden">
        {bubbles.map((bubble, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.15 + index * 0.05,
            }}
            viewport={{ once: false, amount: 0.5 }}
            onClick={bubble.action}
            className="flex flex-row items-center cursor-pointer"
          >
            <div
              className="hover:cursor-pointer hover:scale-110 hover:bg-white/24 
                    transition-transform w-10 h-10 flex justify-center items-center 
                    rounded-[8px] mr-2 bg-white/20 text-white"
            >
              {bubble.icon}
            </div>
            <span className="font-semibold mb-2 pt-2">{bubble.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
