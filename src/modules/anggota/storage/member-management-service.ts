import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { LocalUser, LocalUserSchema } from "@/modules/auth/logic/local-auth-store";
import { hashPasswordSync } from "@/modules/auth/logic/password-hasher";
import { generatePrefixedId } from "@/shared/utils/id-generator";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { z } from "zod";
import { canManageAnggota, canDeleteAnggota } from "../logic/member-permissions";
import { logMemberActivity } from "./member-activity-logger";

const USERS_KEY = "drg_local_users_v1";

export interface NewMemberPayload {
  nama: string;
  email: string;
  no_hp: string;
  password?: string;
  role: LocalUser["role"];
  jenjang: LocalUser["jenjang"];
  status: LocalUser["status"];
  pangkalan?: string;
  plat_nomor?: string;
  jenis_kendaraan?: string;
  merk_kendaraan?: string;
  alamat?: string;
  tanggal_lahir?: string;
  golongan_darah?: "A" | "B" | "AB" | "O" | "-";
  kontak_darurat_nama?: string;
  kontak_darurat_hp?: string;
  kontak_darurat_hubungan?: string;
}

export class MemberManagementService {
  static addMember(payload: NewMemberPayload, actorRole?: string) {
    if (!canManageAnggota(actorRole)) {
      throw new Error(
        "Akses ditolak: Hanya Admin, Ketua, dan Dewan Etik yang dapat menambah anggota.",
      );
    }
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.nama.trim();
    if (!cleanName) throw new Error("Nama lengkap wajib diisi.");
    if (!cleanEmail) throw new Error("Email wajib diisi.");

    const users = LocalAuthClient.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error(`Email ${cleanEmail} sudah terdaftar.`);
    }

    const defaultPwd = payload.password || "drg12345";
    const passwordHash = hashPasswordSync(defaultPwd);
    const newId = generatePrefixedId("usr");
    const count = users.length + 1;

    const newUser: LocalUser = {
      id: newId,
      email: cleanEmail,
      nama: cleanName,
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

    users.push(newUser);
    safeWriteStorage(USERS_KEY, users);
    logMemberActivity(
      "Pendaftaran Anggota Baru",
      `Penerbitan KTA ${newUser.nomor_anggota} (${newUser.nama}) di ${newUser.pangkalan || "Basecamp Umum"}`,
      newUser.id,
      actorRole,
    );
    return newUser;
  }

  static updateMember(id: string, patch: Partial<LocalUser>, actorRole?: string) {
    if (!canManageAnggota(actorRole)) {
      throw new Error(
        "Akses ditolak: Hanya Admin, Ketua, dan Dewan Etik yang dapat merubah entri anggota.",
      );
    }
    LocalAuthClient.updateUser(id, patch);
    if (patch.status || patch.role) {
      logMemberActivity(
        patch.status ? "Perubahan Status Anggota" : "Mutasi Peran Anggota",
        `Perubahan akun (${id}): ${patch.status ? `status -> ${patch.status}` : ""} ${patch.role ? `peran -> ${patch.role}` : ""}`.trim(),
        id,
        actorRole,
      );
    }
  }

  static verifyMember(id: string, actorRole?: string) {
    if (!canManageAnggota(actorRole)) {
      throw new Error("Akses ditolak: Hanya Pengurus yang dapat memverifikasi status anggota.");
    }
    LocalAuthClient.updateUser(id, { status: "aktif" });
    logMemberActivity(
      "Verifikasi Anggota",
      `Verifikasi sah keanggotaan (${id}) menjadi status Aktif`,
      id,
      actorRole,
    );
  }

  static deleteMember(targetId: string, currentUserId: string, actorRole?: string) {
    if (!canDeleteAnggota(currentUserId, targetId, actorRole)) {
      throw new Error(
        "Akses ditolak: Anda tidak memiliki izin atau tidak dapat menghapus akun Anda sendiri.",
      );
    }
    const users = safeReadStorage(USERS_KEY, z.array(LocalUserSchema), []);
    const filtered = users.filter((u) => u.id !== targetId);
    safeWriteStorage(USERS_KEY, filtered);
    logMemberActivity(
      "Penghapusan Anggota",
      `Penghapusan data akun anggota (${targetId})`,
      targetId,
      actorRole,
    );
  }
}
