import {
  ScreeningApplication,
  ScreeningAnswerItem,
  ScreeningAuditItem,
} from "@/modules/screening/types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

const APPS_KEY = "drg_screening_apps_v2";
const ANSWERS_KEY = "drg_screening_answers_v2";
const AUDIT_KEY = "drg_screening_audit_v2";

export function getStoredScreeningApplications(): ScreeningApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScreeningApplication(
  app: Omit<
    ScreeningApplication,
    "status" | "created_at" | "skor_total" | "catatan_pic" | "email_verified"
  >,
) {
  const current = getStoredScreeningApplications();
  const newApp: ScreeningApplication = {
    ...app,
    status: "menunggu",
    skor_total: null,
    catatan_pic: null,
    created_at: new Date().toISOString(),
    email_verified: false,
  };
  const updated = [newApp, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(APPS_KEY, JSON.stringify(updated));
  }
  return newApp;
}

export function updateScreeningApplication(id: string, patch: Partial<ScreeningApplication>) {
  const current = getStoredScreeningApplications();
  const app = current.find((a) => a.id === id);
  if (!app) return;

  const oldStatus = app.status;
  const newStatus = patch.status ?? oldStatus;

  const updated = current.map((a) => (a.id === id ? { ...a, ...patch } : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(APPS_KEY, JSON.stringify(updated));
  }

  if (oldStatus !== newStatus) {
    addScreeningAuditLog(
      id,
      oldStatus,
      newStatus,
      patch.catatan_pic ?? "Status diperbarui oleh pengurus.",
    );
  }
}

export function getStoredScreeningAnswers(appId: string): ScreeningAnswerItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[appId] ?? [];
  } catch {
    return [];
  }
}

export function saveScreeningAnswers(
  appId: string,
  answers: Array<{ question_id: string; jawaban: string }>,
) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    const all = raw ? JSON.parse(raw) : {};

    const storedAnswers: ScreeningAnswerItem[] = answers.map((ans) => ({
      jawaban: ans.jawaban,
      bobot_didapat: 0,
      question_id: ans.question_id,
      screening_questions: null,
    }));

    all[appId] = storedAnswers;
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getStoredScreeningAuditLogs(appId: string): ScreeningAuditItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[appId] ?? [];
  } catch {
    return [];
  }
}

export function addScreeningAuditLog(
  appId: string,
  oldStatus: string,
  newStatus: string,
  note: string,
) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const current = all[appId] ?? [];

    const session = LocalAuthClient.getSession();
    const actorId = session?.user.id ?? "usr-anon";
    const actorName = session?.user.user_metadata?.nama || "Anggota DRG";

    const newAudit: ScreeningAuditItem = {
      id: `audit-${Date.now()}`,
      old_status: oldStatus,
      new_status: newStatus,
      note,
      created_at: new Date().toISOString(),
      actor_id: actorId,
      profiles: {
        nama: actorName,
      },
    };

    all[appId] = [newAudit, ...current];
    localStorage.setItem(AUDIT_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}
