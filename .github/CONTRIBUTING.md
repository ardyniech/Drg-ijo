# Panduan Kontribusi & Kolaborasi Tim (Team Collaboration Guide)

Selamat datang di proyek **DRG Satu Aspal**! Panduan ini mengatur alur kerja kolaborasi tim, penetapan peran, dan prosedur peninjauan Pull Request (PR).

---

## 1. Peran Tim & Hak Akses (Team Roles & Permissions)

| Peran (Role) | Tanggung Jawab & Hak Akses | Contoh Tindakan |
| :--- | :--- | :--- |
| **Admin** | Pemilik repositori, pengelola konfigurasi CI/CD, branch protection, dan persetujuan deploy. | Menggabungkan PR ke branch `main`, mengelola token rahasia, merilis versi baru. |
| **Penulis (Author / Maintainer)** | Pengembang fitur inti modul, pemelihara kode, dan peninjau kode (*code reviewer*). | Membuat branch fitur, menulis kode, meninjau PR rekan tim, menyetujui perubahan. |
| **Kontributor (Contributor)** | Anggota tim / sedulur pengemudi yang mengajukan perbaikan atau fitur pendukung. | Membuat pull request dari forked repo/branch baru, melaporkan isu bug. |

---

## 2. Alur Kerja Git & Penamaan Branch (Branching Strategy)

Gunakan pola cabang (*branching*) berbasis trunk (*trunk-based development*):
- `feat/[nama-modul]-[deskripsi-singkat]` (contoh: `feat/kas-export-pdf`)
- `fix/[nama-modul]-[deskripsi-singkat]` (contoh: `fix/kejadian-gps-accuracy`)
- `docs/[topik]` (contoh: `docs/panduan-arsitektur`)

---

## 3. Prosedur Peninjauan & Penggabungan PR (Code Review & Merge)

1. **Buat Pull Request:** Buka PR dari branch kerja Anda ke branch `main`.
2. **Gunakan Template PR:** Isi semua bagian dalam `.github/pull_request_template.md`.
3. **Pemeriksaan CI Otomatis:** GitHub Actions akan otomatis menjalankan:
   - Pemeriksaan ESLint & format kode.
   - Pengecekan tipe TypeScript (`tsc --noEmit`).
   - Eksekusi automated unit test via Vitest.
   - Pengecekan build produksi Vite/Nitro.
   - Audit batas baris berkas (< 125 baris per berkas).
4. **Persetujuan Peninjau (Peer Review):**
   - Minimal **1 persetujuan (*approval*)** dari Penulis/Maintainer untuk modul terkait.
   - Perubahan pada `src/core/`, `.github/`, atau `package.json` memerlukan **persetujuan Admin**.
5. **Metode Penggabungan (Merge Strategy):**
   - Gunakan **Squash and Merge** untuk menjaga riwayat komit tetap rapi dan linier.
   - Dilarang keras *force push* pada branch bersama (`main`).

---

## 4. Panduan Aktivasi di Pengaturan GitHub (Repository Settings)

Untuk menerapkan aturan kolaborasi ini di repositori GitHub Anda:

1. **Menambahkan Kolaborator & Peran:**
   - Buka menu **Settings** > **Collaborators and teams**.
   - Klik **Add people** > masukkan username GitHub rekan tim.
   - Pilih peran: **Admin** untuk lead arsitektur, atau **Write** untuk Penulis/Maintainer.

2. **Mengaktifkan Branch Protection pada `main`:**
   - Buka **Settings** > **Branches** > klik **Add branch protection rule**.
   - Masukkan Branch name pattern: `main`.
   - Centang **Require a pull request before merging**:
     - Atur *Required approvals* minimal `1`.
     - Centang *Dismiss stale pull request approvals when new commits are pushed*.
     - Centang *Require review from Code Owners*.
   - Centang **Require status checks to pass before merging**:
     - Pilih check: `Lint, Test & Build Validation`.
   - Centang **Require linear history**.
   - Klik **Save changes**.
