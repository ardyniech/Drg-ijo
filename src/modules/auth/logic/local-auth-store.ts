import { UserRole } from "@/hooks/use-me";

export interface LocalUser {
  id: string;
  email: string;
  nama: string;
  no_hp?: string;
  role: UserRole;
  jenjang: "calon" | "muda" | "madya" | "purna";
  status: "aktif" | "nonaktif" | "cuti" | "pending_review";
  passwordHash: string;
  created_at: string;
}

export interface LocalSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: {
    id: string;
    email: string;
    user_metadata: {
      nama: string;
      full_name: string;
      role: string;
    };
  };
}

export const DEFAULT_USERS: LocalUser[] = [
  {
    id: "usr-superadmin",
    email: "ardy.syafii@gmail.com",
    nama: "Ardy Syafii",
    no_hp: "08123456789",
    role: "super_admin",
    jenjang: "purna",
    status: "aktif",
    passwordHash: "admin12345",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export function createLocalSession(user: LocalUser): LocalSession {
  return {
    access_token: `loc_tok_${user.id}_${Date.now()}`,
    token_type: "bearer",
    expires_in: 86400 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { nama: user.nama, full_name: user.nama, role: user.role },
    },
  };
}
