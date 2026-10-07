# Dokumentasi Modul: Role Management & Akses Organisasi

## 1. Ikhtisar Utama
Modul **Role Management** pada DRG App berfungsi untuk mengelola struktur kepengurusan organisasi Komunitas Driver Riang Gembira (DRG). Berbeda dengan **Jenjang Karir Driver** (*Calon -> Pratama -> Madya -> Utama*), Role Management berfokus pada **Jabatan Organisasi & Otoritas Mandat** (*Ketua Umum, Sekretaris Jenderal, Bendahara Keuangan, Admin Sistem, Korlap Satgas, Satgas Lapangan, Dewan Etik, dan Driver Anggota*).

---

## 2. Hirarki & Peran Organisasi

| Kode Role | Nama Peran | Kategori | Level | Kewenangan Utama |
| :--- | :--- | :--- | :---: | :--- |
| `ketua` | **Ketua Umum** | Pengurus Inti | Level 1 | Pemimpin tertinggi, penandatanganan SK resmi, pengesahan kebijakan, approval keuangan & audit etik. |
| `sekretaris` | **Sekretaris Jenderal** | Pengurus Inti | Level 2 | Pengelola administrasi, penyusun notulen musyawarah, validasi dokumen, dan pendaftaran anggota. |
| `bendahara` | **Bendahara Keuangan** | Pengurus Inti | Level 2 | Pemegang otoritas kas sosial & koperasi, approval pencairan dana, verifikasi bukti transfer, laporan neraca. |
| `admin` | **Admin Sistem** | Pengurus Inti | Level 2 | Pengelola teknis akun, konfigurasi database, manajemen peran, dan pemeliharaan platform. |
| `korlap` | **Korlap Satgas** | Lapangan | Level 3 | Koordinator pangkalan, penanggung jawab jadwal shift piket posko wilayah. |
| `satgas` | **Satgas Lapangan** | Lapangan | Level 3 | Petugas siaga tanggap darurat 24 jam untuk sinyal SOS (laka, mogok, penawalan medis). |
| `dewan_etik` | **Dewan Etik** | Pengawas | Level 2 | Badan independen penyelesai sengketa antar driver, penegak kode etik, penerbitan sanksi. |
| `anggota` / `driver` | **Driver Anggota** | Keanggotaan | Level 4 | Anggota driver aktif ber-KTA dengan iuran transparan, klaim bantuan sosial, dan sinyal darurat. |

---

## 3. Matriks Hak Akses (Permissions)

- **`manage_roles`**: Hak mengaitkan, merotasi, dan mengubah jabatan pengurus. (*Ketua, Sekretaris, Admin*)
- **`sign_sk`**: Hak menerbitkan dan menandatangani Surat Keputusan (SK) Mandat resmi. (*Ketua, Sekretaris, Dewan Etik*)
- **`manage_notulen`**: Hak mengesahkan berita acara musyawarah dan rapat pleno. (*Ketua, Sekretaris, Admin*)
- **`approve_finance`**: Hak menyetujui transaksi kas dan pencairan klaim sosial. (*Ketua, Bendahara*)
- **`manage_piket`**: Hak mengatur rotasi shift dan penugasan posko pangkalan. (*Ketua, Korlap, Satgas, Admin*)
- **`handle_sos`**: Hak mengendalikan tim tanggap darurat saat terjadi sinyal SOS. (*Ketua, Korlap, Satgas, Admin*)
- **`manage_ethics`**: Hak memproses laporan pelanggaran dan menetapkan persidangan. (*Ketua, Dewan Etik*)
- **`verify_members`**: Hak memvalidasi berkas calon anggota baru. (*Ketua, Sekretaris, Bendahara, Admin, Korlap*)

---

## 4. Alur Kerja Penetapan Jabatan & Audit Log

1. **Akses Pengurus**: Ketua, Sekretaris, atau Admin membuka rute `/roles` melalui menu **Administrasi -> Manajemen Peran**.
2. **Pemilihan Anggota**: Pilih anggota dari tabel `RoleMembersTable` dan klik **"Ubah Peran"**.
3. **Pengisian Mandat (SK)**:
   - Pilih Jabatan Baru dari `AVAILABLE_ROLES`.
   - Masukkan **Nomor SK Mandat** (contoh: `SK-KETUA/DRG/05/2026`).
   - Tuliskan **Catatan Musyawarah / Alasan Penetapan**.
4. **Penyimpanan Instan**:
   - `LocalAuthClient.updateUser` memperbarui role anggota di penyimpanan lokal.
   - Perekaman otomatis entri kronologis ke `RoleAuditLog` di `localStorage`.
   - Invalidasi cache TanStack Query memicu pembaruan badge profil dan menu sidebar tanpa *reload* halaman.

---

## 5. Panduan Penguji & Developer Selanjutnya

- **Demo Login**:
  - `ketua@drg.id` (password: `ketua12345`)
  - `sekretaris@drg.id` (password: `sekretaris12345`)
  - `bendahara@drg.id` (password: `bendahara12345`)
  - `admin@drg.id` (password: `admin12345`)
  - `satgas@drg.id` (password: `satgas12345`)
  - `driver@drg.id` (password: `driver12345`)
- **Struktur Berkas Kode**:
  - `src/modules/roles/types.ts`: Antarmuka tipe data role & audit log.
  - `src/modules/roles/constants.ts`: Konfigurasi badge & deskripsi peran.
  - `src/modules/roles/permissions-constants.ts`: Daftar izin kewenangan.
  - `src/modules/roles/storage/roles-storage.ts`: Adapter penyimpanan lokal & audit log.
  - `src/modules/roles/logic/use-role-management.ts`: Custom hook pengelola state.
  - `src/routes/_authenticated/roles.tsx`: Halaman utama Manajemen Peran.
