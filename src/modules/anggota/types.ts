export type MemberRoleType =
  | "ketua"
  | "sekretaris"
  | "bendahara"
  | "admin"
  | "korlap"
  | "satgas"
  | "dewan_etik"
  | "anggota"
  | "driver";

export interface MemberRecord {
  id: string;
  nama: string;
  no_kta: string;
  no_hp: string;
  pangkalan: string;
  role: MemberRoleType;
  jenjang: "Madya" | "Utama" | "Pratama" | string;
  status: "aktif" | "pending_review" | "nonaktif";
  bergabung_sejak: string;
  plat_nomor: string;
  jenis_kendaraan: string;
}
