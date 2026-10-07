export type MemberRoleType =
  | "ketua"
  | "sekretaris"
  | "bendahara"
  | "admin"
  | "korlap"
  | "satgas"
  | "dewan_etik"
  | "anggota"
  | "driver"
  | "super_admin";

export type MemberStatusType = "aktif" | "pending_review" | "nonaktif";

export interface MemberRecord {
  id: string;
  nama: string;
  no_kta: string;
  no_hp: string;
  pangkalan: string;
  role: MemberRoleType;
  jenjang: "Madya" | "Utama" | "Pratama" | string;
  status: MemberStatusType;
  bergabung_sejak: string;
  plat_nomor: string;
  jenis_kendaraan: string;
  email?: string;
  catatan?: string;
}

export type MemberSortOption = "nama_asc" | "nama_desc" | "terbaru" | "kta";
