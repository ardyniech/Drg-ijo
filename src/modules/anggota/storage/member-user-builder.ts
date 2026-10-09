import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { hashPasswordSync } from "@/modules/auth/logic/password-hasher";
import { generatePrefixedId } from "@/shared/utils/id-generator";
import { NewMemberPayload } from "./member-payload-types";

export function buildNewUser(payload: NewMemberPayload, count: number): LocalUser {
  const defaultPwd = payload.password || "drg12345";
  const passwordHash = hashPasswordSync(defaultPwd);
  const newId = generatePrefixedId("usr");

  return {
    id: newId,
    email: payload.email.trim().toLowerCase(),
    nama: payload.nama.trim(),
    no_hp: payload.no_hp || "",
    role: payload.role || "anggota",
    jenjang: payload.jenjang || "calon",
    status: payload.status || "aktif",
    passwordHash,
    created_at: new Date().toISOString(),
    pangkalan: (payload.pangkalan || "").trim(),
    plat_nomor: payload.plat_nomor || "",
    jenis_kendaraan: payload.jenis_kendaraan || "Sepeda Motor",
    merk_kendaraan: payload.merk_kendaraan || "",
    nomor_anggota: `DRG-2026-${String(count).padStart(3, "0")}`,
    alamat: payload.alamat || "",
    tanggal_lahir: payload.tanggal_lahir || "",
    golongan_darah: payload.golongan_darah || "-",
    kontak_darurat_nama: payload.kontak_darurat_nama || "",
    kontak_darurat_hp: payload.kontak_darurat_hp || "",
    kontak_darurat_hubungan: payload.kontak_darurat_hubungan || "Keluarga",
  };
}
