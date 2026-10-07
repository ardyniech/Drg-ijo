import { RolePermission } from "./types";

export const PERMISSIONS_LIST: RolePermission[] = [
  {
    id: "manage_roles",
    name: "Manajemen Peran Pengurus",
    category: "Administrasi",
    description: "Menetapkan, merotasi, dan mengubah jabatan pengurus",
  },
  {
    id: "sign_sk",
    name: "Pengesahan SK & Mandat",
    category: "Legalitas",
    description: "Menandatangani Surat Keputusan resmi komunitas",
  },
  {
    id: "manage_notulen",
    name: "Administrasi & Notulen",
    category: "Dokumentasi",
    description: "Membuat dan mengesahkan notulen musyawarah",
  },
  {
    id: "approve_finance",
    name: "Approval Keuangan Kas",
    category: "Keuangan",
    description: "Menyetujui transaksi, pencairan dana, dan laporan kas",
  },
  {
    id: "manage_piket",
    name: "Manajemen Jadwal Piket",
    category: "Operasional",
    description: "Mengatur rotasi shift dan penugasan satgas",
  },
  {
    id: "handle_sos",
    name: "Respon Tanggap Darurat",
    category: "Operasional",
    description: "Mengkoordinasikan tim tanggap darurat saat sinyal SOS",
  },
  {
    id: "manage_ethics",
    name: "Sidang Disiplin & Etik",
    category: "Pengawasan",
    description: "Memproses laporan pelanggaran dan menetapkan mediasi",
  },
  {
    id: "verify_members",
    name: "Verifikasi Calon Anggota",
    category: "Keanggotaan",
    description: "Memvalidasi berkas pendaftaran calon driver baru",
  },
];
