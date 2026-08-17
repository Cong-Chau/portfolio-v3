export const VI_MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function parseMonthYear(val: string): { month: number; year: number } | null {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();

  // Match "Tháng 08/2024" or "Tháng 8/2024" or "Tháng 8, 2024"
  const viMatch = trimmed.match(/Tháng\s*0?([1-9]|1[0-2])[/,\s]+(\d{4})/i);
  if (viMatch) {
    return { month: parseInt(viMatch[1], 10), year: parseInt(viMatch[2], 10) };
  }

  // Match MM/YYYY or M/YYYY
  const slashMatch = trimmed.match(/^0?([1-9]|1[0-2])[/-](\d{4})$/);
  if (slashMatch) {
    return { month: parseInt(slashMatch[1], 10), year: parseInt(slashMatch[2], 10) };
  }

  // Match YYYY-MM
  const isoMatch = trimmed.match(/^(\d{4})[/-]0?([1-9]|1[0-2])$/);
  if (isoMatch) {
    return { month: parseInt(isoMatch[2], 10), year: parseInt(isoMatch[1], 10) };
  }

  // Match English month name "Aug 2024", "August 2024", "Aug, 2024"
  const enNames = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  for (let i = 0; i < enNames.length; i++) {
    const regex = new RegExp(`^${enNames[i]}[a-z]*[\\s,]+(\\d{4})`, "i");
    const match = trimmed.match(regex);
    if (match) {
      return { month: i + 1, year: parseInt(match[1], 10) };
    }
  }

  // Fallback: search for 4 digit year
  const yearMatch = trimmed.match(/\b(\d{4})\b/);
  if (yearMatch) {
    return { month: new Date().getMonth() + 1, year: parseInt(yearMatch[1], 10) };
  }

  return null;
}

export function formatMonthYearVi(month: number, year: number): string {
  const mm = String(month).padStart(2, "0");
  return `Tháng ${mm}/${year}`;
}

export function formatMonthYearEn(month: number, year: number): string {
  return `${EN_MONTHS[month - 1]} ${year}`;
}

export interface DateRangeState {
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  isPresent: boolean;
}

export function parseDateRange(valVi?: string, valEn?: string): DateRangeState {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const res: DateRangeState = {
    startMonth: currentMonth,
    startYear: currentYear,
    endMonth: currentMonth,
    endYear: currentYear,
    isPresent: false,
  };

  const raw = (valVi || valEn || "").trim();
  if (!raw) return res;

  // Check if contains "hiện tại" or "present"
  const hasPresent = /hiện tại|present|now/i.test(raw) || (valEn ? /present/i.test(valEn) : false);

  // Split by range delimiter: - or – or to
  const parts = raw.split(/\s*[-–—]\s*|\s+to\s+/i);

  if (parts.length >= 2) {
    const startParsed = parseMonthYear(parts[0]);
    if (startParsed) {
      res.startMonth = startParsed.month;
      res.startYear = startParsed.year;
    }

    if (hasPresent) {
      res.isPresent = true;
    } else {
      const endParsed = parseMonthYear(parts[1]);
      if (endParsed) {
        res.endMonth = endParsed.month;
        res.endYear = endParsed.year;
        res.isPresent = false;
      }
    }
  } else {
    // Single date value
    const parsed = parseMonthYear(raw);
    if (parsed) {
      res.startMonth = parsed.month;
      res.startYear = parsed.year;
      res.endMonth = parsed.month;
      res.endYear = parsed.year;
    }
    if (hasPresent) {
      res.isPresent = true;
    }
  }

  return res;
}

export function formatDateRangeVi(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number,
  isPresent: boolean,
): string {
  if (!startMonth || !startYear) return "";
  const startStr = formatMonthYearVi(startMonth, startYear);
  if (isPresent) {
    return `${startStr} - Hiện tại`;
  }
  if (endMonth && endYear) {
    return `${startStr} - ${formatMonthYearVi(endMonth, endYear)}`;
  }
  return startStr;
}

export function formatDateRangeEn(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number,
  isPresent: boolean,
): string {
  if (!startMonth || !startYear) return "";
  const startStr = formatMonthYearEn(startMonth, startYear);
  if (isPresent) {
    return `${startStr} - Present`;
  }
  if (endMonth && endYear) {
    return `${startStr} - ${formatMonthYearEn(endMonth, endYear)}`;
  }
  return startStr;
}
