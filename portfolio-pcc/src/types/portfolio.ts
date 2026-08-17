// ─── API Response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

// ─── Personal Info ─────────────────────────────────────────────────────────────
export interface PersonalInfo {
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

// ─── Skills ────────────────────────────────────────────────────────────────────
export interface SkillItem {
  id: number;
  title: string;
  iconClass: string;
}

export interface SkillsData {
  techs: SkillItem[];
  tools: SkillItem[];
}

// ─── Projects ──────────────────────────────────────────────────────────────────
export interface ProjectUrl {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  completeTime: string;
  description: string;
  highlight: string;
  skills: string[];
  urls: ProjectUrl[];
}

// ─── Portfolio (full) ─────────────────────────────────────────────────────────
export interface PortfolioData {
  personal: PersonalInfo;
  aboutMes: string[];
  skills: SkillsData;
  projects: Project[];
}
