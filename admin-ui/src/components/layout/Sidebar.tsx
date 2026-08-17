import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  BookOpen,
  Cpu,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin/personal", icon: User, label: "Personal Info" },
  { to: "/admin/about", icon: BookOpen, label: "About Me" },
  { to: "/admin/skills", icon: Cpu, label: "Skills" },
  { to: "/admin/projects", icon: Briefcase, label: "Projects" },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-primary text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <LayoutDashboard size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Admin</p>
          <p className="text-xs text-white/50 leading-tight">Portfolio CMS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/8 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-white/30">v1.0.0</p>
      </div>
    </aside>
  );
};
