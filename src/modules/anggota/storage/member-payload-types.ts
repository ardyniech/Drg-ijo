import { LocalUser } from "@/modules/auth/logic/local-auth-store";

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
