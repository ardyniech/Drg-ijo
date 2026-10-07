# Arsitektur & Panduan Pengembang Proyek DRG App

## 1. Filosofi Arsitektur (SOP v4.0)
DRG App dibangun dengan prinsip **Simplicity is King** & **Build One and Forget**. Seluruh modul bersifat terisolasi (*zero cross-module import* liar), performa tinggi, dan tangguh bekerja secara offline (*Local-First*).

---

## 2. Aturan Batasan Kode

1. **Maksimal 125 Baris Kode Per Berkas**:
   - Seluruh komponen UI, controller, hook, dan storage adapter wajib di bawah 125 baris.
   - Bila menyentuh baris 126, wajib dipecah ke sub-komponen, hook, atau helper terpisah.
2. **Penyimpanan Local-First + Server Sync**:
   - Seluruh mutasi ditulis ke penyimpanan lokal (`localStorage` / SQLite Adapter) secara *optimistic*.
   - Outbox pattern mengantrekan mutasi `pending_ops` dan dikirim ke server secara *background*.
3. **Audit Status Jujur**:
   - Tanpa fabrikasi status sukses. Setiap transaksi membedakan tiga state: *Sukses Nyata*, *Tersimpan Lokal*, dan *Gagal*.

---

## 3. Peta Direktori & Modul Utama

```
src/
├── components/                  # UI Components
│   ├── layout/                  # SidebarNav, SidebarUserFooter, Header
│   ├── ui/                      # Base Atomic UI (Dialog, Button, Badge)
│   └── page-shell.tsx           # Wrapper Halaman Utama
├── hooks/                       # Global Hooks (useMe, useMyRole, useIs)
├── integrations/
│   └── supabase/                # Local Database Adapter & Query Builder
├── modules/
│   ├── activity-log/            # Audit Trail & Log Aktivitas Lintas Peran
│   ├── anggota/                 # Direktori Anggota & KTA Digital
│   ├── auth/                    # Client Autentikasi & Akun Demo Pengurus
│   ├── daftar/                  # Pendaftaran Calon Anggota & Screening
│   ├── dashboard/               # Widget Dashboard Spesifik Peran (8 Roles)
│   ├── etik/                    # Sidang Disiplin Dewan Etik
│   ├── inventaris/              # Inventaris Posko & Peminjaman Alat
│   ├── kaderisasi/              # Evaluasi Jenjang & Sertifikat Kader
│   ├── kas/                     # Transparansi Kas Gotong Royong & Koperasi
│   ├── kejadian/                # Sinyal Darurat SOS & Patroli Satgas
│   ├── notulen/                 # Notulen Rapat Musyawarah
│   ├── onboarding/              # Misi Pengenalan Komunitas & Progress
│   ├── persetujuan/             # Antrean Verifikasi Admin & Pengurus
│   ├── peta/                    # Peta Live Position & Pangkalan
│   ├── piket/                   # Jadwal Shift Piket & Tukar Shift
│   ├── profil/                  # Profil Saya & KTA Digital
│   ├── roles/                   # Struktur Peran Organisasi & SK Mandat
│   └── screening/               # Bank Soal & Hasil Screening
├── routes/                      # TanStack Router File Routes
└── shared/                      # Utility Lintas Modul & Design Tokens
```

---

## 4. Matriks Ringkasan Rute & Hak Akses Rute

| Rute | Nama Halaman | Hak Akses Utama |
| :--- | :--- | :--- |
| `/` | Landing Page Komunitas | Publik |
| `/auth` | Masuk & Daftar Akun | Publik (Quick Switcher Pengurus Demo) |
| `/daftar` | Pendaftaran Screening Calon | Publik |
| `/dashboard` | Dashboard Terpadu & Peran | Terautentikasi (Widget Khusus Peran) |
| `/roles` | Manajemen Peran & SK Mandat | Ketua Umum, Sekretaris, Admin |
| `/kas` | Kas & Keuangan Koperasi | Terautentikasi (Approval oleh Bendahara/Ketua) |
| `/kejadian` | Sinyal SOS & Laporan Darurat | Terautentikasi (Satgas & Korlap) |
| `/peta` | Peta Live & Lokasi Pangkalan | Terautentikasi |
| `/piket` | Jadwal Piket & Tukar Shift | Terautentikasi (Manajemen oleh Korlap) |
| `/anggota` | Data Anggota & KTA Digital | Terautentikasi |
| `/notulen` | Notulen Rapat Musyawarah | Terautentikasi (Dikelola Sekretaris) |
| `/etik` | Sidang Etik & Sanksi Disiplin | Terautentikasi (Dikelola Dewan Etik) |
| `/persetujuan` | Persetujuan Verifikasi Akun | Ketua Umum, Sekretaris, Admin |
| `/inventaris` | Inventaris Alat & Posko | Terautentikasi |
| `/kaderisasi` | Evaluasi Jenjang Driver | Terautentikasi |
| `/profil` | Profil Saya & KTA Digital | Terautentikasi |
