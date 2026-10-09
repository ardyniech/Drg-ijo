import { ApprovalItem } from "../types";
import { INITIAL_APPROVALS } from "./initial-approvals";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

const STORAGE_KEY = "drg_approvals_data_v1";
let inMemoryStore: ApprovalItem[] | null = null;

export function getApprovalsList(): ApprovalItem[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return inMemoryStore ?? INITIAL_APPROVALS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPROVALS));
      return INITIAL_APPROVALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPROVALS;
  }
}

export function saveApprovalsList(list: ApprovalItem[]) {
  inMemoryStore = list;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function addApplicantApproval(applicant: {
  nama: string;
  no_hp: string;
  email: string;
  alamat?: string;
  kota?: string;
}) {
  const current = getApprovalsList();
  const newItem: ApprovalItem = {
    id: `appr-${Date.now()}`,
    type: "registrasi_baru",
    applicantName: applicant.nama,
    applicantPhone: applicant.no_hp,
    applicantEmail: applicant.email,
    plateNumber: "N/A (Verifikasi)",
    appliedBase: applicant.kota ? `Pangkalan ${applicant.kota}` : "",
    appliedRole: "Driver Anyar",
    status: "pending",
    appliedAt: new Date().toISOString(),
  };
  saveApprovalsList([newItem, ...current]);
  return newItem;
}

export function resolveApproval(
  id: string,
  status: "approved" | "rejected",
  notes?: string,
): ApprovalItem[] {
  const current = getApprovalsList();
  const target = current.find((item) => item.id === id);
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          reviewNotes: notes,
          reviewedAt: new Date().toISOString(),
          reviewedBy: "Admin Pusat",
        }
      : item,
  );
  saveApprovalsList(updated);
  if (target) {
    if (status === "approved" && target.applicantEmail) {
      const users = LocalAuthClient.getUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === target.applicantEmail.toLowerCase(),
      );
      if (matched) LocalAuthClient.updateUser(matched.id, { status: "aktif" });
    }
    enqueueOperation({
      idempotencyKey: `appr-${id}-${Date.now()}`,
      action: status === "approved" ? "Persetujuan Akun" : "Penolakan Akun",
      module: "persetujuan",
      payload: { id, status, notes, applicantName: target.applicantName },
    });
    recordActivityLog({
      actorId: "admin-pusat",
      actorName: "Admin Pusat & Pengurus",
      actorRole: "admin",
      action: status === "approved" ? "Persetujuan Verifikasi Akun" : "Penolakan Verifikasi Akun",
      module: "persetujuan",
      description: `${status === "approved" ? "Menyetujui" : "Menolak"} pengajuan ${target.type.replace("_", " ")} untuk ${target.applicantName}.`,
    });
  }
  return updated;
}
