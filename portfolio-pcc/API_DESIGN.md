# 🌐 Thiết kế Hệ thống API cho Portfolio (Read-only APIs)

Tài liệu này định nghĩa các RESTful API Endpoints phục vụ nhu cầu đọc và hiển thị dữ liệu trực tiếp trên giao diện Client của ứng dụng **portfolio-pcc**. Nhóm này là các API công khai (Public APIs), không yêu cầu đăng nhập.

---

## 🗺️ Bảng tổng hợp các API Endpoints

| Method | Path | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/v1/portfolio` | **(Khuyên dùng)** Lấy toàn bộ dữ liệu trang web (Home, About, Skills, Projects) trong 1 request duy nhất |
| **GET** | `/api/v1/portfolio/personal` | Lấy thông tin cá nhân (phục vụ Landing & Contact) |
| **GET** | `/api/v1/portfolio/about` | Lấy danh sách các dòng văn bản giới thiệu bản thân |
| **GET** | `/api/v1/portfolio/skills` | Lấy danh sách các kỹ năng và công cụ (chia theo category) |
| **GET** | `/api/v1/portfolio/projects` | Lấy danh sách dự án hoàn chỉnh |

---

## 📖 Chi tiết đặc tả các API

### 1. API Tổng hợp Toàn bộ Portfolio (`GET /api/v1/portfolio`)
* **Mục đích**: Frontend gọi API này duy nhất 1 lần khi ứng dụng khởi chạy (Preloader). Dữ liệu sau đó sẽ được đưa vào State/Context để hiển thị cho toàn bộ các Section, tối ưu hóa tốc độ tải và giảm thiểu số lượng HTTP request.
* **Query Parameters**:
  * `lang` (String): Ngôn ngữ trả về (`vi` hoặc `en`). Mặc định là `vi`.
* **Phản hồi mẫu (200 OK - `lang=vi`)**:
```json
{
  "personal": {
    "name": "PHAN CÔNG CHÂU",
    "title": "Xin chào, tôi là Phan Công Châu",
    "summary": "Là một fullstack developer đam mê xây dựng các giải pháp web toàn diện, lấy người dùng làm trung tâm và không ngừng phát triển để mang lại trải nghiệm số chất lượng cao.",
    "email": "congchau206@gmail.com",
    "phone": "0703913350",
    "location": "TP Hồ Chí Minh",
    "linkedinUrl": "https://www.linkedin.com/in/phancongchau20062004/",
    "githubUrl": "https://github.com/Cong-Chau",
    "avatarUrl": "/images/avatar.jpg",
    "cvUrl": "/pdfs/PhanCongChau_CV_FullStack_Intern.pdf"
  },
  "aboutMes": [
    "Xin chào, tôi là Phan Công Châu.",
    "Tôi tập trung vào phát triển web fullstack, hướng đến việc tạo ra những trải nghiệm số mượt mà, hiệu quả và thẩm mỹ.",
    "Tôi yêu thích cả frontend và backend, biến ý tưởng thành các ứng dụng web hoàn chỉnh.",
    "Tôi luôn học hỏi và khám phá công nghệ mới để nâng cao kỹ năng và bắt kịp xu hướng phát triển hiện đại.",
    "Mục tiêu của tôi là xây dựng những sản phẩm web chất lượng cao, có khả năng mở rộng và mang lại giá trị thực cho người dùng."
  ],
  "skills": {
    "techs": [
      { "id": 1, "title": "HTML5", "iconClass": "devicon-html5-plain colored" },
      { "id": 4, "title": "React JS", "iconClass": "devicon-react-original colored" }
    ],
    "tools": [
      { "id": 7, "title": "Github", "iconClass": "devicon-github-original" },
      { "id": 8, "title": "MySQL", "iconClass": "devicon-mysql-original colored" }
    ]
  },
  "projects": [
    {
      "id": 1,
      "title": "ACCI Exam Management System",
      "completeTime": "08/2025 - Hiện tại",
      "description": "Hệ thống quản lý thi chứng chỉ Anh ngữ & Tin học ACCI, hỗ trợ đăng ký, thanh toán, gia hạn, phát hành phiếu dự thi và cấp chứng chỉ.",
      "highlight": "Triển khai FE/BE tách biệt, mô hình hóa đầy đủ quy trình nghiệp vụ từ đăng ký đến cấp chứng chỉ.",
      "skills": ["React", "Tailwind CSS", "Express.js", "Node.js", "MySQL"],
      "urls": [
        { "label": "Client Repo", "url": "https://github.com/Cong-Chau/ACCI-Client" },
        { "label": "Server Repo", "url": "https://github.com/Cong-Chau/ACCI-Server" }
      ]
    }
  ]
}
```

---

### 2. API Kỹ năng (`GET /api/v1/portfolio/skills`)
* **Mục đích**: Trả về danh sách kỹ năng được nhóm theo nhóm: Công nghệ (`techs`) và Công cụ (`tools`). Không phụ thuộc ngôn ngữ vì các class icon và tên công nghệ giữ nguyên.
* **Phản hồi mẫu (200 OK)**:
```json
{
  "techs": [
    { "id": 1, "title": "HTML5", "iconClass": "devicon-html5-plain colored" },
    { "id": 2, "title": "CSS3", "iconClass": "devicon-css3-plain colored" }
  ],
  "tools": [
    { "id": 7, "title": "Github", "iconClass": "devicon-github-original" }
  ]
}
```

---

### 3. API Dự án (`GET /api/v1/portfolio/projects`)
* **Query Parameters**:
  * `lang` (String): Ngôn ngữ của tiêu đề, thời gian, mô tả và highlight (`vi` hoặc `en`). Mặc định là `vi`.
* **Phản hồi mẫu (200 OK - `lang=en`)**:
```json
[
  {
    "id": 1,
    "title": "ACCI Exam Management System",
    "completeTime": "08/2025 - Now",
    "description": "ACCI English & IT Certificate Exam Management System supporting registration, payment, renewal, exam slip issuance, and certification.",
    "highlight": "Deployed separated FE/BE architecture, modeled full business workflow from registration to certification.",
    "skills": ["React", "Tailwind CSS", "Express.js", "Node.js", "MySQL"],
    "urls": [
      { "label": "Client Repo", "url": "https://github.com/Cong-Chau/ACCI-Client" },
      { "label": "Server Repo", "url": "https://github.com/Cong-Chau/ACCI-Server" }
    ]
  }
]
```
