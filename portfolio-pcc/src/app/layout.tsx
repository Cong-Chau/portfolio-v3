import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/sessions/Background";
import Preloader from "@/components/common/Preloader";
import TargetCursor from "@/components/cards/TargetCursor";
import { LanguageProvider } from "@/context/LanguageContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phan Công Châu - Fullstack Developer",
  description: "Portfolio cá nhân của Phan Công Châu - Fullstack Developer...",
  keywords: [
    "Phan Công Châu",
    "Fullstack Developer",
    "React",
    "Next.js",
    "TailwindCSS",
    "Portfolio",
  ],
  authors: [{ name: "Phan Công Châu" }],
  icons: { icon: "/images/favicon.png" },
  openGraph: {
    title: "Phan Công Châu - Fullstack Developer",
    description:
      "Portfolio cá nhân của Phan Công Châu - Fullstack Developer...",
    url: "https://phancongchau.vercel.app/",
    siteName: "Phan Công Châu Portfolio",
    images: [
      {
        url: "https://phancongchau.vercel.app/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Phan Công Châu",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phan Công Châu - Fullstack Developer",
    description:
      "Portfolio cá nhân của Phan Công Châu - Fullstack Developer...",
    images: ["https://phancongchau.vercel.app/images/preview.png"],
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-full h-full bg-black`}
      >
        <TargetCursor spinDuration={2} hideDefaultCursor={true} />
        <Background />
        <Preloader>
          <LanguageProvider>
            <PortfolioProvider>
              <main className="relative z-10 pt-20">{children}</main>
            </PortfolioProvider>
          </LanguageProvider>
        </Preloader>
      </body>
    </html>
  );
}

export default RootLayout;
