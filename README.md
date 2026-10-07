# 🚗 DRG App — Komunitas Driver Riang Gembira

Platform Digital Mandiri Komunitas Driver Riang Gembira (DRG): Kas Gotong Royong Transparan, Satgas Siaga SOS 24 Jam, Jadwal Piket Pangkalan, Kaderisasi Anggota, Struktur Kepengurusan & Role Management, serta Log Aktivitas Transparan Lintas Peran.

---

## 🎯 Tujuan Utama Proyek

Proyek ini dibangun sebagai solusi tata kelola digital mandiri untuk **Komunitas Driver Riang Gembira (DRG)**. Tujuan utamanya adalah:
- **Demokratisasi Organisasi**: Menyediakan wadah akuntabilitas transparan untuk kas gotong royong dan pengelolaan kontribusi keanggotaan tanpa celah manipulasi.
- **Keselamatan Lapangan**: Melindungi driver di jalan raya lewat integrasi tombol SOS darurat 24 jam dengan koordinasi Satgas regional yang responsif.
- **Kepatuhan & Penjenjangan**: Memastikan sistem kaderisasi yang sehat, kredibel, dan transparan dari jenjang Calon Anggota hingga Anggota Purna di bawah pengawasan langsung Dewan Pengurus dan Dewan Etik.
- **Tata Kelola Mandiri (Local-First)**: Memberikan pengalaman aplikasi berkinerja tinggi yang tangguh dan dapat diakses offline, menempatkan kedaulatan data di genggaman setiap driver anggota.

---

## 🌟 Fitur-Fitur Utama

### 1. Sistem Kepengurusan & Manajemen Peran (Role Management)
- **Permissions Matrix Terpusat**: Mendukung 8 peran kepengurusan resmi dengan otorisasi ketat (*Ketua Umum, Sekretaris Jenderal, Bendahara Keuangan, Admin Sistem, Korlap Satgas, Satgas Lapangan, Dewan Etik, dan Driver Anggota*).
- **Mandat Hukum Resmi**: Penerbitan SK Pengurus resmi komunitas lengkap dengan nomor SK otomatis dan pencatatan log historis yang tidak dapat diubah.

### 2. Transparansi Kas Gotong Royong & Keuangan (`/kas`)
- **Pencatatan Realtime**: Laporan kas masuk dan keluar secara terbuka dengan kuintansi digital berbasis kode QR.
- **Asas Koperasi**: Alokasi dana modal untuk pemberdayaan ekonomi anggota yang dikelola secara kolektif oleh Bendahara Keuangan.

### 3. Satgas SOS & Penanganan Keadaan Darurat (`/kejadian`)
- **Sinyal Darurat Instant**: Tombol SOS untuk melaporkan kecelakaan lalu lintas, kendaraan mogok, atau musibah di jalan raya.
- **Sistem Dispatcing**: Penugasan personel Satgas terdekat dan pelacakan status penanganan kejadian dari awal hingga selesai secara transparan.

### 4. Peta Live & Sebaran Pangkalan (`/peta`)
- **Visualisasi Peta Interaktif**: Peta berbasis OpenStreetMap (Leaflet) yang menunjukkan titik-titik pangkalan resmi dan posisi anggota aktif *On-Bit* yang sedang bertugas.

### 5. Piket Pangkalan & Tukar Shift (`/piket`)
- **Manajemen Jadwal Piket**: Pengaturan piket posko wilayah demi menjamin ketersediaan personel penolong di lapangan.
- **Fitur Tukar Shift**: Pengajuan permohonan tukar jadwal piket antarpengemudi secara mandiri demi fleksibilitas kerja anggota.

### 6. Dewan Etik & Sidang Disiplin (`/etik`)
- **Penyelesaian Sengketa**: Pengaduan kode etik, mediasi konflik antaranggota, dan penetapan sanksi organisasi secara terhormat oleh Dewan Etik.

### 7. Notulen Rapat & Keputusan Musyawarah (`/notulen`)
- **Berita Acara Digital**: Dokumentasi hasil keputusan rapat pengurus dan musyawarah anggota oleh Sekretaris Jenderal untuk rujukan kebijakan komunitas.

---

## 📚 Dokumentasi Struktur & Arsitektur

- 📖 **[Arsitektur & Panduan Pengembang (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)** — Struktur direktori, batasan baris kode (SOP v4.0), & konfigurasi rute aplikasi.
- 🛡️ **[Modul Role Management (`docs/modules/role-management.md`)](docs/modules/role-management.md)** — Hirarki 8 peran organisasi, matriks hak akses, & alur penerbitan SK Mandat.
- 📋 **[Modul Activity Log & Audit Trail (`docs/modules/activity-log.md`)](docs/modules/activity-log.md)** — Sistem pencatatan riwayat tindakan transparan lintas peran.

---

## 🚀 Panduan Instalasi & Cara Menjalankan

Aplikasi ini menggunakan teknologi modern berbasis React SPA, Vite, TypeScript, Tailwind CSS v4, TanStack Router, dan Local Database Adapter (LocalStorage & Supabase Mock).

### Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- Paket manajer **npm** (bawaan Node.js) atau **Bun** (direkomendasikan untuk performa tinggi)

### Langkah-Langkah Instalasi

1. **Kloning Repositori**:
   ```bash
   git clone https://github.com/username/drg-app.git
   cd drg-app
   ```

2. **Instal Dependensi**:
   Menggunakan `npm`:
   ```bash
   npm install
   ```
   Menggunakan `Bun`:
   ```bash
   bun install
   ```

3. **Menjalankan Server Pengembangan (Dev Server)**:
   Menggunakan `npm`:
   ```bash
   npm run dev
   ```
   Menggunakan `Bun`:
   ```bash
   bun dev
   ```
   Aplikasi akan berjalan di alamat `http://localhost:3000` (atau port 5173 secara default tergantung konfigurasi Vite).

4. **Menjalankan Pengujian Terintegrasi (Unit Tests)**:
   Aplikasi ini dilengkapi dengan rangkaian pengujian yang komprehensif (Vitest).
   ```bash
   npm run test
   ```

5. **Membangun Aplikasi untuk Produksi (Production Build)**:
   ```bash
   npm run build
   ```

---

## 👥 Cara Berkontribusi

Kami mengundang kontribusi dari seluruh anggota komunitas DRG dan pengembang open-source untuk membuat DRG App menjadi lebih baik. Ikuti langkah-langkah berikut untuk mulai berkontribusi:

1. **Fork Repositori** ini ke akun GitHub Anda.
2. **Buat Cabang Fitur Baru** dari branch utama:
   ```bash
   git checkout -b fitur/nama-fitur-baru
   ```
3. **Patuhi SOP Arsitektur & Coding (SOP v4.0)**:
   - **Batas Baris per Berkas**: Maksimal **125 baris** per berkas (kecuali konfigurasi rute, serializer model immutable, dan shader). Jika menyentuh 126 baris, wajib dipecah ke sub-komponen atau hooks.
   - **Gaya Desain**: Gunakan tema terang hangat (*warm theme*). Touch target minimal 44pt/48px untuk aksesibilitas driver di lapangan.
   - **Zero-Pill Discipline**: Metadata tidak boleh dibungkus dalam kapsul/pill bulat statis. Gunakan teks bersih dengan pemisah tipografis (`·` atau `/`).
   - **Validasi & Integritas**: Jalankan `npm run lint` dan `npm run test` sebelum mengajukan Pull Request.
4. **Commit Perubahan Anda** dengan pesan commit yang jelas dan deskriptif:
   ```bash
   git commit -m "feat: menambah fitur kalkulasi kas otomatis"
   ```
5. **Push ke Branch Anda**:
   ```bash
   git push origin fitur/nama-fitur-baru
   ```
6. **Ajukan Pull Request (PR)** ke repositori utama kami, sertakan deskripsi perubahan yang jelas dan tangkapan layar (jika ada perubahan visual).

---

## 🔐 Akun Demo untuk Pengujian Fitur

Gunakan akun simulasi cepat di halaman masuk (`/auth`) untuk menguji visualisasi dashboard tiap kepengurusan:
- **Ketua Umum**: `ketua@drg.id` (password: `ketua12345`)
- **Sekretaris Jenderal**: `sekretaris@drg.id` (password: `sekretaris12345`)
- **Bendahara Keuangan**: `bendahara@drg.id` (password: `bendahara12345`)
- **Admin Utama**: `admin@drg.id` (password: `admin12345`)
- **Satgas Lapangan**: `satgas@drg.id` (password: `satgas12345`)
- **Driver Anggota**: `driver@drg.id` (password: `driver12345`)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) — Bebas digunakan untuk pemberdayaan komunitas pengemudi mandiri di seluruh Indonesia.

---
*Dibuat dengan 💚 oleh Komunitas Driver Riang Gembira (DRG).*
