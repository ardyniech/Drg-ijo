import { UserRole } from "@/hooks/use-me";

export const MEMBER_MANAGE_ROLES: readonly string[] = [
  "super_admin",
  "admin",
  "ketua",
  "sekretaris",
  "dewan_etik",
];

export function canManageAnggota(role?: string | null): boolean {
  if (!role) return false;
  return MEMBER_MANAGE_ROLES.includes(role);
}

export function canVerifyAnggota(role?: string | null): boolean {
  if (!role) return false;
  return MEMBER_MANAGE_ROLES.includes(role);
}

export function canEditJenjangAnggota(role?: string | null): boolean {
  if (!role) return false;
  return ["super_admin", "admin", "ketua", "dewan_etik"].includes(role);
}

export function canDeleteAnggota(
  currentUserId: string,
  targetMemberId: string,
  role?: string | null,
): boolean {
  if (!canManageAnggota(role)) return false;
  // Mencegah menghapus akun diri sendiri yang sedang aktif
  if (currentUserId === targetMemberId) return false;
  return true;
}
