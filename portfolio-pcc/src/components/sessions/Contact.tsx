"use client";
import { Github, Linkedin, Mail, MapPin, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { sendMail } from "@/utils/sendMail";
import { callPhone } from "@/utils/callPhone";
import { openLink } from "@/utils/openLink";
import { useState } from "react";

function Contact() {
  const { t, lang } = useLanguage();
  const { data } = usePortfolio();
  const personal = data?.personal;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const contactEmail = personal?.email || "congchau206@gmail.com";
  const contactPhone = personal?.phone || "0703 913 350";
  const contactLocation =
    personal?.location || (lang === "vi" ? "TP Hồ Chí Minh" : "Ho Chi Minh City");
  const contactLinkedin =
    personal?.linkedinUrl || "https://www.linkedin.com/in/phancongchau20062004/";
  const contactGithub = personal?.githubUrl || "https://github.com/Cong-Chau";

  const githubHandle = contactGithub.replace(/^https?:\/\/github\.com\/?/, "");
  const linkedinHandle = contactLinkedin
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, "@")
    .replace(/\/$/, "");

  const handleSend = () => {
    // Validate input
    if (!email || !subject || !name || !message) {
      setError(true);
      return;
    }

    setError(false);
    const body = `From: ${name} (${email})\n\n${message}`;
    sendMail(contactEmail, subject, body);

    // Reset form sau khi gửi
    setEmail("");
    setSubject("");
    setName("");
    setMessage("");
  };

  return (
    <div id="contact" className="w-full pt-12">
      <div
        className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-12 px-4 mb-8
        lg:py-12 lg:px-24
        2xl:pt-24 2xl:px-48"
      >
        {/* Left content */}
        <div className="w-full md:w-2/5 flex flex-col items-center lg:items-start gap-6">
          <p className="w-4/5 lg:w-full pb-3 text-center md:text-left font-bold text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {t("contact.header")}
          </p>
          <p className="hidden md:block text-white w-4/5 lg:w-full text-center md:text-left">
            {t("contact.title1")}
          </p>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white flex flex-row items-center w-4/5 lg:w-full"
          >
            <div
              onClick={() => sendMail(contactEmail)}
              className="cursor-target hover:cursor-pointer hover:scale-105 hover:bg-white/24 transition-transform w-12 h-12 flex justify-center items-center rounded-lg mr-2 bg-white/20"
            >
              <Mail />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Email</p>
              <p className="text-gray-400">{contactEmail}</p>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white flex flex-row items-center w-4/5 lg:w-full"
          >
            <div
              onClick={() => callPhone(contactPhone)}
              className="cursor-target hover:cursor-pointer hover:scale-105 hover:bg-white/24 transition-transform w-12 h-12 flex justify-center items-center rounded-lg mr-2 bg-white/20"
            >
              <PhoneCall />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">
                {lang == "vi" ? "Điện thoại" : "Phone"}
              </p>
              <p className="text-gray-400">{contactPhone}</p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white flex flex-row items-center w-4/5 lg:w-full"
          >
            <div
              onClick={() =>
                openLink(
                  `https://www.google.com/maps?q=${encodeURIComponent(
                    contactLocation
                  )}`
                )
              }
              className="cursor-target hover:cursor-pointer hover:scale-105 hover:bg-white/24 transition-transform w-12 h-12 flex justify-center items-center rounded-lg mr-2 bg-white/20"
            >
              <MapPin />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">
                {lang == "vi" ? "Vị trí" : "Location"}
              </p>
              <p className="text-gray-400">{contactLocation}</p>
            </div>
          </motion.div>

          {/* Social media */}
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white w-4/5 lg:w-full text-left"
          >
            {t("contact.title2")}
            <span className="font-semibold text-blue-400 ml-1">
              {t("contact.titleSocialMedia")}
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white flex flex-row items-center w-4/5 lg:w-full"
          >
            <div
              onClick={() => openLink(contactLinkedin)}
              className="cursor-target hover:cursor-pointer hover:scale-105 hover:bg-white/24 transition-transform w-12 h-12 flex justify-center items-center rounded-lg mr-2 bg-white/20"
            >
              <Linkedin />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Linkedin</p>
              <p className="text-gray-400">{linkedinHandle}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-white flex flex-row items-center w-4/5 lg:w-full"
          >
            <div
              onClick={() => openLink(contactGithub)}
              className="cursor-target hover:cursor-pointer hover:scale-105 hover:bg-white/24 transition-transform w-12 h-12 flex justify-center items-center rounded-lg mr-2 bg-white/20"
            >
              <Github />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Github</p>
              <p className="text-gray-400">{githubHandle}</p>
            </div>
          </motion.div>
        </div>

        {/* Right form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
          viewport={{ once: false, amount: 0.1 }}
          className="w-4/5 md:w-2/5 bg-white/5 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6"
        >
          <label className="flex flex-col gap-2 text-white">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cursor-target bg-white/10 border border-white/20 rounded-lg px-3 h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-2 text-white">
            <span>{lang == "vi" ? "Tiêu đề" : "Subject"}</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="cursor-target bg-white/10 border border-white/20 rounded-lg px-3 h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-2 text-white">
            <span>{t("contact.form.name")}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cursor-target bg-white/10 border border-white/20 rounded-lg px-3 h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col gap-2 text-white">
            <span>{t("contact.form.message")}</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="cursor-target bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </label>
          <button
            onClick={handleSend}
            className="cursor-target w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:cursor-pointer hover:bg-blue-400 transition"
          >
            {t("contact.form.btn")}
          </button>
          {error && (
            <p className="text-red-400 text-sm">
              {lang === "vi"
                ? "Vui lòng nhập đầy đủ thông tin."
                : "Please fill in all fields."}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
