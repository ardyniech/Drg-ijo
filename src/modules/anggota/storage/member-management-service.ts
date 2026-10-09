import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { LocalUser, LocalUserSchema } from "@/modules/auth/logic/local-auth-store";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { z } from "zod";
import { canManageAnggota, canDeleteAnggota } from "../logic/member-permissions";
import { logMemberActivity } from "./member-activity-logger";
import { NewMemberPayload } from "./member-payload-types";
import { buildNewUser } from "./member-user-builder";

export type { NewMemberPayload };

const USERS_KEY = "drg_local_users_v1";

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

    const newUser = buildNewUser(payload, users.length + 1);
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
