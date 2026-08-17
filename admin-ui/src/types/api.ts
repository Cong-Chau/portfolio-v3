// ─── Generic wrapper ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

// ─── Personal Info ───────────────────────────────────────────────────────────
export interface PersonalInfoRequest {
  name: string;
  titleVi: string;
  titleEn: string;
  summaryVi: string;
  summaryEn: string;
  email: string;
  phone: string;
  locationVi: string;
  locationEn: string;
  linkedinUrl?: string;
  githubUrl?: string;
  avatarUrl?: string;
  cvUrl?: string;
}

export interface UploadCvResponse {
  url: string;
  publicId: string;
  originalFileName: string;
  size: number;
}

export interface UploadImageResponse {
  url: string;
  publicId: string;
  originalFileName: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface PersonalInfoResponse {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  avatarUrl?: string;
  cvUrl?: string;
}

// ─── About Me ────────────────────────────────────────────────────────────────
export interface AboutDetailRequest {
  contentVi: string;
  contentEn: string;
  orderIndex: number;
}

export interface AboutDetailResponse {
  id: number;
  contentVi: string;
  contentEn: string;
  orderIndex: number;
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export const SkillCategory = {
  TECH: "TECH",
  TOOL: "TOOL",
} as const;

export type SkillCategory = (typeof SkillCategory)[keyof typeof SkillCategory];

export interface SkillRequest {
  title: string;
  iconClass: string;
  category: SkillCategory;
  orderIndex: number;
}

export interface SkillResponse {
  id: number;
  title: string;
  iconClass: string;
  category?: SkillCategory;
  orderIndex?: number;
}

export interface SkillsResponse {
  techs: SkillResponse[];
  tools: SkillResponse[];
}

// Group for Admin Skills Page UI
export interface SkillGroupResponse {
  category: SkillCategory;
  skills: SkillResponse[];
}

// ─── Projects ────────────────────────────────────────────────────────────────
export interface ProjectUrl {
  labelVi: string;
  labelEn: string;
  url: string;
}

export interface ProjectUrlResponse {
  label: string;
  url: string;
}

export interface ProjectRequest {
  titleVi: string;
  titleEn: string;
  completeTimeVi: string;
  completeTimeEn: string;
  descriptionVi: string;
  descriptionEn: string;
  highlightVi: string;
  highlightEn: string;
  orderIndex: number;
  skillIds: number[];
  urls: ProjectUrl[];
}

export interface AdminProjectResponse {
  id: number;
  titleVi: string;
  titleEn: string;
  completeTimeVi: string;
  completeTimeEn: string;
  descriptionVi: string;
  descriptionEn: string;
  highlightVi: string;
  highlightEn: string;
  orderIndex: number;
  skills: SkillResponse[];
  urls: ProjectUrl[];
}

export interface ProjectResponse {
  id: number;
  title: string;
  completeTime: string;
  description: string;
  highlight: string;
  skills: string[];
  urls: ProjectUrlResponse[];
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// ─── Language ────────────────────────────────────────────────────────────────
export type Lang = "vi" | "en";

