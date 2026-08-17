# 🚀 Portfolio — Phan Công Châu

> **Portfolio cá nhân** của Phan Công Châu — Fullstack Developer đam mê xây dựng các giải pháp web toàn diện, lấy người dùng làm trung tâm.

🌐 **Live Demo:** [phancongchau.vercel.app](https://phancongchau.vercel.app)

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Tech Stack](#-tech-stack)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy local](#-cài-đặt--chạy-local)
- [Build & Deploy](#-build--deploy)
- [Các section trong trang](#-các-section-trong-trang)
- [Đa ngôn ngữ (i18n)](#-đa-ngôn-ngữ-i18n)
- [SEO & Sitemap](#-seo--sitemap)
- [Liên hệ](#-liên-hệ)

---

## 🎯 Giới thiệu

Đây là website portfolio cá nhân được xây dựng bằng **Next.js 15** và **React 19**, thiết kế theo phong cách **dark mode** hiện đại với nhiều hiệu ứng animation ấn tượng. Website được tối ưu SEO đầy đủ và hỗ trợ **đa ngôn ngữ (Tiếng Việt / English)**.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|-----------|-------|
| 🌗 **Dark Mode** | Giao diện tối chuyên nghiệp với glassmorphism |
| 🌍 **Đa ngôn ngữ** | Hỗ trợ Tiếng Việt & English, chuyển đổi trực tiếp |
| 🎯 **Custom Cursor** | Con trỏ chuột tùy chỉnh với hiệu ứng target (GSAP) |
| ✨ **Particle Background** | Nền hạt 3D sử dụng OGL + WebGL |
| 🎬 **Smooth Animations** | Framer Motion + GSAP cho mọi transition |
| 🃏 **Shuffle Text** | Hiệu ứng xáo trộn chữ khi hover |
| ⌨️ **Typing Effect** | Hiệu ứng gõ chữ tự động |
| 🎴 **3D Tilt Cards** | Thẻ nghiêng 3D khi di chuột (react-parallax-tilt) |
| 📄 **CV Preview** | Xem trước CV trực tiếp trong trang (PDF viewer) |
| 💌 **Contact Form** | Form liên hệ mở email client |
| 📱 **Fully Responsive** | Tương thích mọi thiết bị |
| 🔍 **SEO Optimized** | Meta tags, Open Graph, Twitter Card, Sitemap |
| ⚡ **Preloader** | Màn hình loading mượt mà khi khởi động |

---

## 🛠 Tech Stack

### Core Framework
| Package | Version | Mục đích |
|---------|---------|----------|
| `next` | 15.5.3 | Framework React fullstack |
| `react` | 19.1.0 | Thư viện UI |
| `typescript` | ^5 | Type safety |

### Animation & Visual
| Package | Version | Mục đích |
|---------|---------|----------|
| `framer-motion` | ^12.23.20 | Animation scroll, layout |
| `gsap` + `@gsap/react` | ^3.13.0 | Custom cursor animation |
| `ogl` | ^1.0.11 | WebGL particles background |
| `three` | ^0.180.0 | 3D rendering |
| `@lottiefiles/dotlottie-react` | ^0.17.1 | Lottie animation (landing) |
| `lottie-react` | ^2.4.1 | Hỗ trợ Lottie |
| `react-parallax-tilt` | ^1.7.309 | Hiệu ứng nghiêng 3D card |

### UI & Icons
| Package | Version | Mục đích |
|---------|---------|----------|
| `lucide-react` | ^0.544.0 | Icon library |
| `tailwindcss` | ^4 | Utility-first CSS |
| `devicon` | CDN | Icon ngôn ngữ lập trình |

### Utilities
| Package | Version | Mục đích |
|---------|---------|----------|
| `react-pdf` | ^10.1.0 | Xem CV dạng PDF |
| `pdfobject` | ^2.3.1 | Nhúng PDF |
| `next-sitemap` | ^4.2.3 | Tạo sitemap & robots.txt |

---

## 📁 Cấu trúc dự án

```
portfolio-pcc/
├── public/
│   ├── config/
│   │   └── pdf.worker.min.mjs      # PDF.js worker
│   ├── gifs/
│   │   └── Technology.lottie       # Lottie animation landing
│   ├── images/
│   │   ├── avatar.jpg              # Ảnh đại diện
│   │   ├── favicon.png             # Favicon
│   │   └── preview.png             # OG image (1200×630)
│   ├── locales/
│   │   ├── en/common.json          # Nội dung Tiếng Anh
│   │   └── vi/common.json          # Nội dung Tiếng Việt
│   ├── pdfs/                       # File CV PDF
│   ├── robots.txt                  # SEO robots
│   └── sitemap.xml                 # Sitemap tự động
│
├── src/
│   ├── app/
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout + metadata SEO
│   │   └── page.tsx                # Trang chính (single-page)
│   │
│   ├── components/
│   │   ├── cards/
│   │   │   ├── CVPreview.tsx       # Component xem trước CV PDF
│   │   │   ├── Shuffle.tsx         # Hiệu ứng shuffle text (GSAP)
│   │   │   ├── TargetCursor.tsx    # Custom cursor với GSAP
│   │   │   └── TextType.tsx        # Typing text animation
│   │   │
│   │   ├── common/
│   │   │   └── Preloader.tsx       # Màn hình loading ban đầu
│   │   │
│   │   └── sessions/
│   │       ├── Header.tsx          # Navigation cố định (fixed)
│   │       ├── Landing.tsx         # Section giới thiệu
│   │       ├── About.tsx           # Section about me + CV
│   │       ├── Skills.tsx          # Section kỹ năng & công cụ
│   │       ├── Projects.tsx        # Section dự án
│   │       ├── Contact.tsx         # Section liên hệ + form
│   │       ├── Footer.tsx          # Footer
│   │       ├── Background.tsx      # Wrapper background
│   │       └── Particles.tsx       # WebGL particle system
│   │
│   ├── context/
│   │   └── LanguageContext.tsx     # i18n context (VI/EN)
│   │
│   └── utils/
│       ├── callPhone.ts            # Mở ứng dụng gọi điện
│       ├── openLink.ts             # Mở link trong tab mới
│       └── sendMail.ts             # Mở email client
│
├── next.config.ts                  # Cấu hình Next.js
├── next-sitemap.config.js          # Cấu hình sitemap
├── tailwind.config.js              # Cấu hình Tailwind CSS v4
├── tsconfig.json                   # TypeScript config
└── package.json
```

---

## 🚀 Cài đặt & Chạy local

### Yêu cầu
- **Node.js** >= 18.x
- **npm** >= 9.x (hoặc yarn / pnpm)

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/Cong-Chau/portfolio-pcc.git
cd portfolio-pcc

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server
npm run dev
```

Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Build & Deploy

```bash
# Build production
npm run build

# Chạy production server
npm start

# Lint code
npm run lint
```

> **Lưu ý:** Script `postbuild` sẽ tự động chạy `next-sitemap` để tạo `sitemap.xml` và `robots.txt` sau khi build thành công.

### Deploy lên Vercel (Khuyến nghị)

Dự án được cấu hình sẵn để deploy lên **[Vercel](https://vercel.com)**:

1. Push code lên GitHub
2. Import repository vào Vercel
3. Vercel tự động detect Next.js và deploy

---

## 🗂 Các section trong trang

Trang web là **Single Page Application** với các section được điều hướng qua anchor links:

| Section | ID | Mô tả |
|---------|----|-------|
| **Header** | — | Navigation cố định, chuyển đổi ngôn ngữ |
| **Landing** | `#home` | Tên, chức danh, typing effect, liên kết mạng xã hội, nút tải CV |
| **About** | `#about` | Ảnh đại diện, giới thiệu bản thân, xem trước CV PDF |
| **Skills** | `#skills` | Grid kỹ năng công nghệ (HTML, CSS, JS, React, Tailwind, Node.js) và công cụ (GitHub, MySQL, Postman) |
| **Projects** | `#projects` | Danh sách 6 dự án với mô tả, tech stack, link GitHub |
| **Contact** | `#contact` | Thông tin liên hệ, form gửi email, mạng xã hội |
| **Footer** | — | Quick links, social links, copyright |

### Danh sách dự án

| Dự án | Thời gian | Tech Stack |
|-------|-----------|-----------|
| Hệ thống quản lý nhà hàng | 11/2024 – 12/2024 | Handlebars, Express.js, Node.js, MySQL |
| Nền tảng tạo video bằng AI | 05/2025 – 07/2025 | React, Tailwind CSS, Python, MongoDB |
| ACCI Exam Management System | 08/2025 – Hiện tại | React, Redux Toolkit, Express.js, Node.js, MySQL |
| Hệ thống quản lý đại lý | 11/2024 – 12/2024 | Handlebars, Express.js, Node.js, MySQL |
| Remote Desktop | 11/2024 – 12/2024 | C++, Windows API, Winsock, Multithreading |
| Quản lý khóa học (Console App) | 04/2023 – 06/2023 | C++, File I/O, Data Structures |

---

## 🌍 Đa ngôn ngữ (i18n)

Dự án sử dụng **custom i18n** không dùng thư viện bên ngoài — đơn giản, nhẹ, hiệu quả.

### Cách hoạt động

1. **Translation files** được lưu tại `public/locales/{lang}/common.json`
2. **`LanguageContext`** (`src/context/LanguageContext.tsx`) cung cấp:
   - `lang`: ngôn ngữ hiện tại (`"vi"` | `"en"`)
   - `setLang`: hàm chuyển đổi ngôn ngữ
   - `t(key)`: hàm lấy text theo dot-notation key (ví dụ: `t("landing.title")`)
3. Mặc định hiển thị **Tiếng Việt**, toggle bằng nút 🌐 trên Header

### Cấu trúc file ngôn ngữ

```json
{
  "header": { "name": "...", "nav": [...] },
  "landing": { "title": "...", "sumary": "...", "CV": "..." },
  "about": { "header": "...", "title": "...", "aboutMes": [...] },
  "skills": { "header": "...", "title": "...", "techs": "...", "tools": "..." },
  "projects": { "header": "...", "title": "...", "projects": [...] },
  "contact": { "header": "...", "title1": "...", "form": {...} },
  "footer": { "title": "...", "quickLink": {...}, "connect": "..." }
}
```

### Thêm ngôn ngữ mới

1. Tạo thư mục `public/locales/{lang-code}/`
2. Thêm file `common.json` với đúng cấu trúc key
3. Đăng ký trong `LanguageContext.tsx`

---

## 🔍 SEO & Sitemap

### Metadata (layout.tsx)
- ✅ Title & Description
- ✅ Keywords
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Card
- ✅ Favicon
- ✅ Canonical URL

### Sitemap & Robots
- **Sitemap:** `https://phancongchau.vercel.app/sitemap.xml`
- **Robots:** `https://phancongchau.vercel.app/robots.txt`
- Tự động tạo sau mỗi lần `npm run build` bởi `next-sitemap`

---

## 📬 Liên hệ

| Kênh | Thông tin |
|------|-----------|
| 📧 Email | [congchau206@gmail.com](mailto:congchau206@gmail.com) |
| 📞 Phone | [0703 913 350](tel:+84703913350) |
| 💼 LinkedIn | [linkedin.com/in/phancongchau20062004](https://www.linkedin.com/in/phancongchau20062004/) |
| 🐙 GitHub | [github.com/Cong-Chau](https://github.com/Cong-Chau) |
| 📍 Location | TP. Hồ Chí Minh, Việt Nam |

---

<div align="center">

**Thiết kế & Phát triển bởi Phan Công Châu** © 2025

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://phancongchau.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)

</div>
