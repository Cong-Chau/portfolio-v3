# admin-ui

Giao diện quản trị được xây dựng bằng **React**, TypeScript, Vite, Tailwind CSS và React Router.

---

## 🚀 Tech Stack

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| [React](https://react.dev/) | ^19.2 | Thư viện UI chính |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Kiểm tra kiểu tĩnh |
| [Vite](https://vite.dev/) | ^8.1 | Build tool & dev server cực nhanh |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.3 | Utility-first CSS framework |
| [React Router](https://reactrouter.com/) | ^7.18 | Điều hướng phía client |
| [ESLint](https://eslint.org/) | ^10.5 | Linting & kiểm tra chất lượng code |

---

## 📁 Cấu trúc dự án

```
src/
├── api/                # Các hàm gọi API
├── assets/             # Hình ảnh, icon, font, ...
├── components/         # Các component tái sử dụng
├── config/             # Cấu hình môi trường, hằng số
├── context/            # React Context (global state)
├── hooks/              # Custom React Hooks
├── pages/              # Các trang (route-level components)
├── router/             # Cấu hình React Router
├── types/              # TypeScript type & interface
├── utils/              # Các hàm tiện ích
├── App.tsx
├── main.tsx
├── App.css
└── index.css
```

---

## ⚙️ Bắt đầu

### Yêu cầu

- [Node.js](https://nodejs.org/) >= 18.x
- npm >= 9.x

### Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Dev server mặc định chạy tại: `http://localhost:5173`

### Biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> Tất cả biến môi trường sử dụng trong Vite phải có tiền tố `VITE_`.

---

## 🛠️ Các lệnh thường dùng

```bash
npm run dev        # Khởi động development server (HMR)
npm run build      # Build production (tsc + vite build)
npm run preview    # Xem trước bản build production
npm run lint       # Kiểm tra lỗi với ESLint
```

---

## 🏗️ Quy ước phát triển

### Components

- Đặt tên theo **PascalCase**: `UserCard.tsx`, `NavBar.tsx`
- Nhóm file liên quan vào cùng thư mục:

```
components/
└── UserCard/
    ├── UserCard.tsx
    └── UserCard.css
```

### Custom Hooks

- Tiền tố bắt buộc là `use`: `useAuth.ts`, `useFetch.ts`
- Đặt trong `src/hooks/`

### API Layer

- Tập trung toàn bộ logic gọi API trong `src/api/`
- Phân chia theo domain: `auth.ts`, `users.ts`, ...

---

## 📄 License

[MIT](LICENSE)
