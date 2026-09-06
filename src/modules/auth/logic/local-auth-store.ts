export interface LocalUser {
  id: string;
  email: string;
  nama: string;
  no_hp?: string;
  role: "super_admin" | "admin" | "bendahara" | "satgas" | "anggota" | "dewan_etik";
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
    id: "usr-admin-01",
    email: "admin@drg.id",
    nama: "Admin Utama DRG",
    no_hp: "081234567890",
    role: "admin",
    jenjang: "purna",
    status: "aktif",
    passwordHash: "admin12345",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-satgas-01",
    email: "satgas@drg.id",
    nama: "Satgas Lapangan DRG",
    no_hp: "081298765432",
    role: "satgas",
    jenjang: "madya",
    status: "aktif",
    passwordHash: "satgas12345",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-bendahara-01",
    email: "bendahara@drg.id",
    nama: "Bendahara Kas DRG",
    no_hp: "081345678901",
    role: "bendahara",
    jenjang: "madya",
    status: "aktif",
    passwordHash: "bendahara12345",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-driver-01",
    email: "driver@drg.id",
    nama: "Bang Parjo Driver",
    no_hp: "081567890123",
    role: "anggota",
    jenjang: "muda",
    status: "aktif",
    passwordHash: "driver12345",
    created_at: "2026-01-01T00:00:00Z",
  },
];
