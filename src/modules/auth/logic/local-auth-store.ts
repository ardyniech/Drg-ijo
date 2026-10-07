import { z } from "zod";
import { UserRole } from "@/hooks/use-me";
import { generatePrefixedId } from "@/shared/utils/id-generator";

export const LocalUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nama: z.string(),
  no_hp: z.string().optional().nullable(),
  role: z.string() as z.ZodType<UserRole>,
  jenjang: z.enum(["calon", "muda", "madya", "purna"]),
  status: z.enum(["aktif", "nonaktif", "cuti", "pending_review"]),
  passwordHash: z.string(),
  created_at: z.string(),
  tanggal_lahir: z.string().optional().nullable(),
  jenis_kelamin: z.enum(["L", "P"]).optional().nullable(),
  golongan_darah: z.enum(["A", "B", "AB", "O", "-"]).optional().nullable(),
  alamat: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  foto_url: z.string().optional().nullable(),
  plat_nomor: z.string().optional().nullable(),
  jenis_kendaraan: z.string().optional().nullable(),
  merk_kendaraan: z.string().optional().nullable(),
  nomor_stnk: z.string().optional().nullable(),
  pangkalan: z.string().optional().nullable(),
  nomor_anggota: z.string().optional().nullable(),
  kontak_darurat_nama: z.string().optional().nullable(),
  kontak_darurat_hp: z.string().optional().nullable(),
  kontak_darurat_hubungan: z.string().optional().nullable(),
  notif_sos: z.boolean().optional(),
  notif_kas: z.boolean().optional(),
  notif_pengumuman: z.boolean().optional(),
  notif_email: z.boolean().optional(),
});

export const LocalSessionSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  expires_at: z.number(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    user_metadata: z.object({
      nama: z.string(),
      full_name: z.string(),
      role: z.string(),
    }),
  }),
});

export type LocalUser = z.infer<typeof LocalUserSchema>;
export type LocalSession = z.infer<typeof LocalSessionSchema>;

export function createLocalSession(user: LocalUser): LocalSession {
  const token = generatePrefixedId(`loc_tok_${user.id}`);
  return {
    access_token: token,
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
