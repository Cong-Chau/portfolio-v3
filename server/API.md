# Portfolio & Admin API Documentation

Tài liệu này đặc tả toàn bộ các API trong dự án.

## Base URL
- **Public Portfolio API**: `/v1/portfolio`
- **Health Check API**: `/v1/health`
- **Admin API**: `/v1/admin`

---

## 0. Health Check API

### 0.1 Kiểm Tra Kết Nối Server & Database
- **Method & Endpoint**: `GET /v1/health`
- **Mô tả**: Thực hiện truy vấn `SELECT 1` tới database PostgreSQL để kiểm tra trạng thái hoạt động của hệ thống và kết nối DB.
- **Response thành công (200 OK)**:
  ```json
  {
    "code": 200,
    "message": null,
    "result": {
      "status": "UP",
      "database": "UP",
      "message": "Database connection is healthy"
    }
  }
  ```
- **Response thất bại (503 Service Unavailable)**:
  ```json
  {
    "code": 503,
    "message": null,
    "result": {
      "status": "DOWN",
      "database": "DOWN",
      "message": "Database connection failed: <chi tiết lỗi>"
    }
  }
  ```

---

## 1. Public Portfolio APIs

*(Tất cả các API ở phần này đều hỗ trợ query parameter `lang` (tùy chọn) với giá trị mặc định là `vi` (Vietnamese).)*

### 1.1 Lấy Toàn Bộ Dữ Liệu Portfolio
- **Method & Endpoint**: `GET /v1/portfolio`
- **Query Params**:
  - `lang` (String, optional, default: `vi`)
- **Response**: `ApiResponse<PortfolioResponse>`
  - Trả về đối tượng `PortfolioResponse` chứa thông tin cá nhân, about, kỹ năng, và danh sách dự án.
- **Status Code**: `200 OK`

### 1.2 Lấy Thông Tin Cá Nhân (Personal Info)
- **Method & Endpoint**: `GET /v1/portfolio/personal`
- **Query Params**:
  - `lang` (String, optional, default: `vi`)
- **Response**: `ApiResponse<PersonalInfoResponse>`
- **Status Code**: `200 OK`

### 1.3 Lấy Danh Sách "About Me"
- **Method & Endpoint**: `GET /v1/portfolio/about`
- **Query Params**:
  - `lang` (String, optional, default: `vi`)
- **Response**: `ApiResponse<List<String>>`
- **Status Code**: `200 OK`

### 1.4 Lấy Danh Sách Kỹ Năng (Skills)
- **Method & Endpoint**: `GET /v1/portfolio/skills`
- **Query Params**: *(Không có)*
- **Response**: `ApiResponse<SkillsResponse>`
- **Status Code**: `200 OK`

### 1.5 Lấy Danh Sách Dự Án (Projects)
- **Method & Endpoint**: `GET /v1/portfolio/projects`
- **Query Params**:
  - `lang` (String, optional, default: `vi`)
- **Response**: `ApiResponse<List<ProjectResponse>>`
- **Status Code**: `200 OK`

---

## 2. Admin APIs

*(Các API ở phần này yêu cầu xác thực - thường là qua Header `Authorization: Bearer <token>` nếu JWT đã được cấu hình trong dự án).*

### 2.1 Quản Lý Thông Tin Cá Nhân & Upload File

#### Upload Avatar (Ảnh cá nhân)
- **Method & Endpoint**: `POST /v1/admin/avatar/upload`
- **Content-Type**: `multipart/form-data`
- **Form Data (Body)**:
  - `file`: File ảnh (chấp nhận `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`, `.bmp`, `.avif`, tối đa 10MB)
- **Response**: `ApiResponse<UploadImageResponse>`
  ```json
  {
    "code": 200,
    "message": null,
    "result": {
      "url": "https://res.cloudinary.com/.../avatar_example.png",
      "publicId": "portfolio/avatar/avatar_example",
      "originalFileName": "my_avatar.png",
      "size": 102400,
      "width": 500,
      "height": 500,
      "format": "png"
    }
  }
  ```
- **Status Code**: `200 OK`
- *Ghi chú: API này sau khi upload thành công lên Cloudinary sẽ tự động cập nhật trường `avatar_url` trong bảng `personal_info`.*

#### Upload Hình Ảnh Chung (Projects, Skills, ...)
- **Method & Endpoint**: `POST /v1/admin/images/upload`
- **Content-Type**: `multipart/form-data`
- **Form Data (Body)**:
  - `file`: File ảnh (tối đa 10MB)
  - `folder`: (Optional, String) Thư mục trên Cloudinary (mặc định: `portfolio/images`)
- **Response**: `ApiResponse<UploadImageResponse>`
- **Status Code**: `200 OK`

#### Upload File CV (PDF)
- **Method & Endpoint**: `POST /v1/admin/cv/upload`
- **Content-Type**: `multipart/form-data`
- **Form Data (Body)**:
  - `file`: File nhị phân (chỉ chấp nhận `.pdf`, kích thước tối đa 10MB)
- **Response**: `ApiResponse<UploadCvResponse>`
  ```json
  {
    "code": 200,
    "message": null,
    "result": {
      "url": "https://res.cloudinary.com/.../cv_example.pdf",
      "publicId": "portfolio/cv/cv_example",
      "originalFileName": "my_resume.pdf",
      "size": 524288
    }
  }
  ```
- **Status Code**: `200 OK`
- *Ghi chú: API này sau khi upload thành công lên Cloudinary sẽ tự động cập nhật trường `cv_url` trong bảng `personal_info`.*

#### Lấy Thông Tin Cá Nhân (Admin - Đầy Đủ Song Ngữ)
- **Method & Endpoint**: `GET /v1/admin/personal`
- **Response**: `ApiResponse<AdminPersonalInfoResponse>`
- **Status Code**: `200 OK`

#### Cập Nhật Thông Tin Cá Nhân
- **Method & Endpoint**: `PUT /v1/admin/personal`
- **Request Body** (`PersonalInfoRequest`):
  ```json
  {
    "name": "string (bắt buộc, tối đa 100 ký tự)",
    "titleVi": "string (bắt buộc)",
    "titleEn": "string (bắt buộc)",
    "summaryVi": "string (bắt buộc)",
    "summaryEn": "string (bắt buộc)",
    "email": "string (bắt buộc, đúng định dạng email, tối đa 100 ký tự)",
    "phone": "string (bắt buộc, tối đa 20 ký tự)",
    "locationVi": "string (bắt buộc, tối đa 150 ký tự)",
    "locationEn": "string (bắt buộc, tối đa 150 ký tự)",
    "linkedinUrl": "string (tùy chọn)",
    "githubUrl": "string (tùy chọn)",
    "avatarUrl": "string (tùy chọn)",
    "cvUrl": "string (tùy chọn)"
  }
  ```
- **Response**: `ApiResponse<AdminPersonalInfoResponse>`
- **Status Code**: `200 OK`

### 2.2 Quản Lý Giới Thiệu (About Details)

#### Lấy Danh Sách Giới Thiệu (Admin)
- **Method & Endpoint**: `GET /v1/admin/about`
- **Response**: `ApiResponse<List<AboutDetailResponse>>`
  ```json
  {
    "code": 200,
    "message": null,
    "result": [
      {
        "id": 1,
        "contentVi": "Đoạn giới thiệu tiếng Việt...",
        "contentEn": "About me paragraph in English...",
        "orderIndex": 0
      }
    ]
  }
  ```
- **Status Code**: `200 OK`

#### Tạo Mới Giới Thiệu
- **Method & Endpoint**: `POST /v1/admin/about`
- **Request Body** (`AboutDetailRequest`):
  ```json
  {
    "contentVi": "string (bắt buộc)",
    "contentEn": "string (bắt buộc)",
    "orderIndex": "integer (bắt buộc, >= 0)"
  }
  ```
- **Response**: `ApiResponse<AboutDetailResponse>`
- **Status Code**: `201 Created`

#### Cập Nhật Giới Thiệu
- **Method & Endpoint**: `PUT /v1/admin/about/{id}`
- **Path Variables**: `id` (ID của AboutDetail cần sửa)
- **Request Body**: Tương tự như API Tạo mới (`AboutDetailRequest`)
- **Response**: `ApiResponse<AboutDetailResponse>`
- **Status Code**: `200 OK`

#### Xóa Giới Thiệu
- **Method & Endpoint**: `DELETE /v1/admin/about/{id}`
- **Path Variables**: `id`
- **Response**: `ApiResponse<Void>` (Body sẽ rỗng)
- **Status Code**: `204 No Content`

### 2.3 Quản Lý Kỹ Năng (Skills)

#### Lấy Danh Sách Kỹ Năng (Admin)
- **Method & Endpoint**: `GET /v1/admin/skills`
- **Response**: `ApiResponse<List<SkillResponse>>`
  ```json
  {
    "code": 200,
    "message": null,
    "result": [
      {
        "id": 1,
        "title": "Java",
        "iconClass": "devicon-java-plain colored",
        "category": "TECH",
        "orderIndex": 0
      }
    ]
  }
  ```
- **Status Code**: `200 OK`

#### Tạo Mới Kỹ Năng
- **Method & Endpoint**: `POST /v1/admin/skills`
- **Request Body** (`SkillRequest`):
  ```json
  {
    "title": "string (bắt buộc, tối đa 50 ký tự)",
    "iconClass": "string (bắt buộc, tối đa 100 ký tự)",
    "category": "enum (SkillCategory) (bắt buộc, vd: TECH, TOOL)",
    "orderIndex": "integer (bắt buộc, >= 0)"
  }
  ```
- **Response**: `ApiResponse<SkillResponse>`
- **Status Code**: `201 Created`

#### Cập Nhật Kỹ Năng
- **Method & Endpoint**: `PUT /v1/admin/skills/{id}`
- **Path Variables**: `id` (ID của Skill cần sửa)
- **Request Body**: Tương tự như API Tạo mới (`SkillRequest`)
- **Response**: `ApiResponse<SkillResponse>`
- **Status Code**: `200 OK`

#### Xóa Kỹ Năng
- **Method & Endpoint**: `DELETE /v1/admin/skills/{id}`
- **Path Variables**: `id`
- **Response**: `ApiResponse<Void>` (Body sẽ rỗng)
- **Status Code**: `204 No Content`

### 2.4 Quản Lý Dự Án (Projects)

#### Lấy Danh Sách Dự Án (Admin)
- **Method & Endpoint**: `GET /v1/admin/projects`
- **Response**: `ApiResponse<List<AdminProjectResponse>>`
- **Status Code**: `200 OK`

#### Lấy Chi Tiết Một Dự Án (Admin)
- **Method & Endpoint**: `GET /v1/admin/projects/{id}`
- **Path Variables**: `id`
- **Response**: `ApiResponse<AdminProjectResponse>`
- **Status Code**: `200 OK`

#### Tạo Mới Dự Án
- **Method & Endpoint**: `POST /v1/admin/projects`
- **Request Body** (`ProjectRequest`):
  ```json
  {
    "titleVi": "string (bắt buộc)",
    "titleEn": "string (bắt buộc)",
    "completeTimeVi": "string (bắt buộc)",
    "completeTimeEn": "string (bắt buộc)",
    "descriptionVi": "string (bắt buộc)",
    "descriptionEn": "string (bắt buộc)",
    "highlightVi": "string (bắt buộc)",
    "highlightEn": "string (bắt buộc)",
    "orderIndex": "integer (bắt buộc, >= 0)",
    "skillIds": [
      1, 2, 3
    ],
    "urls": [
      {
        "labelVi": "string (bắt buộc, tối đa 50 ký tự)",
        "labelEn": "string (bắt buộc, tối đa 50 ký tự)",
        "url": "string (bắt buộc, định dạng URL hợp lệ)"
      }
    ]
  }
  ```
- **Response**: `ApiResponse<AdminProjectResponse>`
- **Status Code**: `201 Created`

#### Cập Nhật Dự Án
- **Method & Endpoint**: `PUT /v1/admin/projects/{id}`
- **Path Variables**: `id` (ID của Project cần sửa)
- **Request Body**: Tương tự như API Tạo mới (`ProjectRequest`)
- **Response**: `ApiResponse<AdminProjectResponse>`
- **Status Code**: `200 OK`

#### Bật/Tắt Hiển Thị Dự Án Trên Portfolio
- **Method & Endpoint**: `PATCH /v1/admin/projects/{id}/toggle-visibility`
- **Path Variables**: `id`
- **Response**: `ApiResponse<AdminProjectResponse>`
- **Status Code**: `200 OK`

#### Ẩn Dự Án Khỏi Portfolio (Soft Delete)
- **Method & Endpoint**: `DELETE /v1/admin/projects/{id}`
- **Path Variables**: `id`
- **Response**: `ApiResponse<Void>` (Body sẽ rỗng)
- **Status Code**: `204 No Content`
- *Ghi chú: Thay vì xóa cứng khỏi cơ sở dữ liệu làm mất dữ liệu lịch sử, API này chuyển trường `is_visible = false` để ẩn dự án khỏi giao diện Portfolio công khai.*

### 2.5 Dịch Thuật Tự Động Với Gemini AI (Translation)

#### Dịch Văn Bản Giữa Tiếng Việt và Tiếng Anh
- **Method & Endpoint**: `POST /v1/admin/translate`
- **Request Body** (`TranslateRequest`):
  ```json
  {
    "text": "string (bắt buộc, văn bản cần dịch)",
    "sourceLang": "string (tùy chọn, mặc định: vi)",
    "targetLang": "string (bắt buộc, ví dụ: en hoặc vi)",
    "context": "string (tùy chọn, ví dụ: bio, project description, job title...)"
  }
  ```
- **Response**: `ApiResponse<TranslateResponse>`
  ```json
  {
    "code": 200,
    "message": null,
    "result": {
      "translatedText": "I am a full-stack developer passionate about building scalable web applications.",
      "sourceLang": "vi",
      "targetLang": "en"
    }
  }
  ```
- **Status Code**: `200 OK`
