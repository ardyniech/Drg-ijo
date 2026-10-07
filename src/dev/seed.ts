import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { hashPasswordSync } from "@/modules/auth/logic/password-hasher";

/**
 * Dev-Only & Seed Initial Dataset (SOP v4.0)
 * Data default diisolasi khusus untuk environment development & testing.
 */
export const SEED_DEFAULT_USERS: LocalUser[] = [
  {
    id: "usr-superadmin",
    email: "ardy.syafii@gmail.com",
    nama: "Ardy Syafii",
    no_hp: "08123456789",
    role: "super_admin",
    jenjang: "purna",
    status: "aktif",
    passwordHash: hashPasswordSync("admin12345"),
    created_at: "2026-01-01T00:00:00Z",
  },
];

export function getInitialSeedUsers(): LocalUser[] {
  return SEED_DEFAULT_USERS.map((u) => ({ ...u }));
}
