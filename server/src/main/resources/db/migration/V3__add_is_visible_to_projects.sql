-- Bước 8: Thêm cột is_visible vào bảng projects để quản lý hiển thị/ẩn dự án (Soft Delete / Visibility Status)
ALTER TABLE projects ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE;
