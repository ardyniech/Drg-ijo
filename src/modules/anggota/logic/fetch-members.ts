import { MemberRecord } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

export async function fetchMembersList(): Promise<MemberRecord[]> {
  const users = LocalAuthClient.getUsers();
  return users.map((u, idx) => ({
    id: u.id,
    nama: u.nama,
    no_kta: u.nomor_anggota || `DRG-2026-${String(idx + 1).padStart(3, "0")}`,
    no_hp: u.no_hp || "-",
    pangkalan: u.pangkalan || "",
    role: (u.role || "driver") as MemberRecord["role"],
    jenjang: u.jenjang || "calon",
    status: (u.status === "aktif"
      ? "aktif"
      : u.status === "cuti"
        ? "nonaktif"
        : "pending_review") as MemberRecord["status"],
    bergabung_sejak: new Date(u.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    plat_nomor: u.plat_nomor || "",
    jenis_kendaraan: u.jenis_kendaraan || "Sepeda Motor",
    email: u.email,
    alamat: u.alamat || "",
    catatan: u.bio || "",
  }));
}
