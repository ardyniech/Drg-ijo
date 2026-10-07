# Panduan Deploy DRG App di Coolify

Aplikasi ini telah di-_fine-tune_ secara menyeluruh agar berjalan sangat ringan, stabil, dan otomatis terdeteksi sehat (_healthy_) di **Coolify** (baik di Sony Vaio, VPS, atau server dedicated).

---

## 1. Langkah Cepat Deploy di Dashboard Coolify

1. **Buat Application Baru:**
   - Masuk ke dashboard Coolify -> Pilih **Project** -> **+ New Resource** -> **Public/Private Repository**.
   - Masukkan link repositori GitHub/Git Anda.

2. **Pilih Build Pack:**
   - Pilih **Dockerfile** (Rekomendasi Utama, menggunakan `Dockerfile` multi-stage kami yang super ringan).
   - _Alternatif:_ Pilih **Nixpacks** (Otomatis membaca `nixpacks.toml`).

3. **Atur Environment Variables di Coolify:**
   Di menu **Environment Variables** Coolify, tambahkan:

   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_APP_URL=https://domain-anda.com
   PORT=3000
   ```

   > **Catatan Penting:** Centang opsi **"Build Variable"** untuk `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` agar Vite dapat menyematkannya ke dalam bundle frontend saat proses build berjalan.

4. **Konfigurasi Port & Health Check:**
   - **Ports Exposes:** `3000`
   - **Health Check Path:** `/api/health`
   - **Health Check Port:** `3000`

5. **Klik "Deploy":**
   - Coolify akan otomatis build dan Traefik langsung mengarahkan domain Anda dengan sertifikat SSL gratis (Let's Encrypt).

---

## 2. Fitur Fine-Tuning Khusus Coolify yang Telah Diterapkan

1. **Sub-millisecond Healthcheck (`/api/health`):**
   - Rute API serverless bawaan yang merespons status JSON tanpa membebani rendering SSR. Traefik Coolify tidak akan pernah mengalami _502 Bad Gateway_.
2. **Low Memory Footprint (Maksimal 384MB RAM):**
   - Flag `--max-old-space-size=384` menjaga kontainer tetap hening dan dingin pada server dengan RAM terbatas.
3. **Non-Root Security:**
   - Kontainer dijalankan dengan user `node` non-root demi keamanan standar industri.
4. **Clean Docker Context (`.dockerignore`):**
   - Mencegah transfer file `.git` atau cache lokal yang memperlambat durasi build hingga 80%.

---

## 3. Resource Limit Rekomendasi (Menu "Resources" di Coolify)

Jika Coolify dijalankan di Sony Vaio atau VPS kecil:

- **Memory Limit:** `512 MB`
- **Memory Reservation:** `128 MB`
- **CPU Limit:** `1.0 Core`
