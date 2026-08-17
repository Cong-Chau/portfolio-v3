import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";
import type { SkillResponse } from "../../types/api";
import { Badge } from "../ui/Badge";

interface SkillTagPickerProps {
  skills: SkillResponse[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export const SkillTagPicker: React.FC<SkillTagPickerProps> = ({
  skills,
  selectedIds,
  onChange,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedSkills = useMemo(
    () => skills.filter((s) => selectedIds.includes(s.id)),
    [skills, selectedIds],
  );

  const suggestions = useMemo(
    () =>
      skills.filter(
        (s) =>
          !selectedIds.includes(s.id) &&
          s.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [skills, selectedIds, query],
  );

  const select = (id: number) => {
    onChange([...selectedIds, id]);
    setQuery("");
  };

  const deselect = (id: number) => {
    onChange(selectedIds.filter((i) => i !== id));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative space-y-2">
      {/* Selected chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence>
            {selectedSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="default" className="flex items-center gap-1.5 pr-1">
                  <i className={`${skill.iconClass} text-sm`} />
                  <span>{skill.title}</span>
                  <button
                    type="button"
                    onClick={() => deselect(skill.id)}
                    className="rounded p-0.5 hover:bg-border transition-colors"
                    id={`deselect-skill-${skill.id}`}
                  >
                    <X size={10} />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search
          size={13}
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm kiếm kỹ năng..."
          className="w-full border-b border-border bg-transparent py-2 pl-5 pr-3 text-sm placeholder:text-text-muted outline-none focus:border-primary transition-colors"
          id="skill-search-input"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
          >
            {suggestions.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  select(skill.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg transition-colors"
                id={`select-skill-${skill.id}`}
              >
                <i className={`${skill.iconClass} text-base shrink-0`} />
                <span>{skill.title}</span>
                <span className="ml-auto text-xs text-text-muted">
                  {skill.category}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
