# Portfolio & Admin API Documentation

Tài liệu này đặc tả toàn bộ các API trong dự án.

## Base URL
- **Public Portfolio API**: `/v1/portfolio`
- **Admin API**: `/v1/admin`

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

### 2.1 Quản Lý Thông Tin Cá Nhân (Personal Info)

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
- **Response**: `ApiResponse<PersonalInfoResponse>`
- **Status Code**: `200 OK`

### 2.2 Quản Lý Giới Thiệu (About Details)

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

#### Tạo Mới Kỹ Năng
- **Method & Endpoint**: `POST /v1/admin/skills`
- **Request Body** (`SkillRequest`):
  ```json
  {
    "title": "string (bắt buộc, tối đa 50 ký tự)",
    "iconClass": "string (bắt buộc, tối đa 100 ký tự)",
    "category": "enum (SkillCategory) (bắt buộc, vd: FRONTEND, BACKEND, DATABASE...)",
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

#### Xóa Dự Án
- **Method & Endpoint**: `DELETE /v1/admin/projects/{id}`
- **Path Variables**: `id`
- **Response**: `ApiResponse<Void>` (Body sẽ rỗng)
- **Status Code**: `204 No Content`
