import {
  ScreeningApplication,
  ScreeningAnswerItem,
  ScreeningAuditItem,
  ScreeningStatus,
} from "@/modules/screening/types";

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

export function saveScreeningApplication(app: Omit<ScreeningApplication, "status" | "created_at">) {
  const current = getStoredScreeningApplications();
  const newApp: ScreeningApplication = {
    ...app,
    status: "menunggu",
    skor_total: Math.floor(Math.random() * 30) + 70, // Generate a nice score
    created_at: new Date().toISOString(),
    email_verified: true,
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

    // Simulate scoring and question mapping
    const simulatedAnswers: ScreeningAnswerItem[] = answers.map((ans) => {
      let qText = "Kuesioner Screening";
      let maxScore = 50;
      if (ans.question_id === "q1") {
        qText = "Berapa lama pengalaman mengemudi Anda?";
        maxScore = 50;
      } else if (ans.question_id === "q2") {
        qText = "Apakah bersedia ikut piket malam darurat?";
        maxScore = 50;
      }

      return {
        jawaban: ans.jawaban,
        bobot_didapat: Math.floor(Math.random() * 15) + 35,
        question_id: ans.question_id,
        screening_questions: {
          pertanyaan: qText,
          bobot_max: maxScore,
        },
      };
    });

    all[appId] = simulatedAnswers;
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

    const newAudit: ScreeningAuditItem = {
      id: `audit-${Date.now()}`,
      old_status: oldStatus,
      new_status: newStatus,
      note,
      created_at: new Date().toISOString(),
      actor_id: "usr-superadmin",
      profiles: {
        nama: "Ardy Syafii",
      },
    };

    all[appId] = [newAudit, ...current];
    localStorage.setItem(AUDIT_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}
