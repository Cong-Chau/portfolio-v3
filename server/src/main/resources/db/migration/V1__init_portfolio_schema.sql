-- Bước 1: Tạo bảng Thông tin cá nhân (Chứa thông tin Header, Landing, Contact info)

CREATE TABLE personal_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    summary_vi TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location_vi VARCHAR(150) NOT NULL,
    location_en VARCHAR(150) NOT NULL,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    avatar_url VARCHAR(255),
    cv_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bước 3: Tạo bảng Đoạn giới thiệu bản thân (About Me)
CREATE TABLE about_details (
    id SERIAL PRIMARY KEY,
    order_index INT NOT NULL DEFAULT 0,
    content_vi TEXT NOT NULL,
    content_en TEXT NOT NULL
);

-- Bước 4: Tạo bảng Kỹ năng & Công cụ (Skills & Tools)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    icon_class VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    order_index INT NOT NULL DEFAULT 0
);

-- Bước 5: Tạo bảng Thông tin Dự án
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title_vi VARCHAR(150) NOT NULL,
    title_en VARCHAR(150) NOT NULL,
    complete_time_vi VARCHAR(50) NOT NULL,
    complete_time_en VARCHAR(50) NOT NULL,
    description_vi TEXT NOT NULL,
    description_en TEXT NOT NULL,
    highlight_vi TEXT NOT NULL,
    highlight_en TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bước 6: Tạo bảng Các đường dẫn đính kèm của Dự án (Mối quan hệ 1 - Nhiều)
CREATE TABLE project_urls (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    label_vi VARCHAR(50) NOT NULL,
    label_en VARCHAR(50) NOT NULL,
    CONSTRAINT fk_project_url FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE
);

-- Bước 7: Tạo bảng liên kết Nhiều - Nhiều giữa Dự án và Kỹ năng sử dụng
CREATE TABLE project_skills (
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT fk_ps_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_ps_skill FOREIGN KEY (skill_id)
        REFERENCES skills(id) ON DELETE CASCADE
);
