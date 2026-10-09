import raw from "./development-log.json";

export interface DevelopmentLogEntry {
  hash: string;
  date: string;
  type: string;
  scope: string | null;
  subject: string;
  body: string[];
}

export interface DevelopmentLog {
  generatedAt: string;
  source: string;
  entries: DevelopmentLogEntry[];
}

export const developmentLog = raw as DevelopmentLog;

export function developmentLogTypeLabel(type: string): string {
  const map: Record<string, string> = {
    feat: "Fitur",
    fix: "Perbaikan",
    refactor: "Refactor",
    chore: "Perawatan",
    docs: "Dokumentasi",
    security: "Keamanan",
    perf: "Performa",
    test: "Pengujian",
    ui: "UI/UX",
    data: "Data",
  };
  return map[type] ?? "Update";
}
