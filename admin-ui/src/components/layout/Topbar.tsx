import React from "react";
import { useLocation } from "react-router-dom";
import { LogOut, ChevronRight, User } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { clearToken } from "../../services/apiClient";

const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Admin",
  personal: "Personal Info",
  about: "About Me",
  skills: "Skills",
  projects: "Projects",
  new: "New Project",
  edit: "Edit Project",
};

export const Topbar: React.FC<{
  saveSlot?: React.ReactNode;
}> = ({ saveSlot }) => {
  const { pathname } = useLocation();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => ({
      label: BREADCRUMB_MAP[seg] ?? seg,
      segment: seg,
    }));

  const handleLogout = () => {
    clearToken();
    window.location.href = "/";
  };

  return (
    <header className="fixed right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-6 backdrop-blur-sm"
      style={{ left: "240px" }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {segments.map((seg, i) => (
          <React.Fragment key={seg.segment}>
            {i > 0 && (
              <ChevronRight size={12} className="text-text-muted" />
            )}
            <span
              className={
                i === segments.length - 1
                  ? "font-semibold text-text-primary"
                  : "text-text-muted"
              }
            >
              {seg.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {saveSlot}
        <LanguageToggle />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <User size={14} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-border/40 hover:text-text-primary"
          title="Đăng xuất"
          id="logout-btn"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  );
};
