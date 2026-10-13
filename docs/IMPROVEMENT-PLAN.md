# Rencana Peningkatan Menyeluruh (Improvement Plan) — DRG App

- **Tanggal:** 2026-10-12
- **Basis commit:** `bd46cdbc` (feat: integrate Firebase for SOS and notification systems)
- **Repo:** `projects/Drg-ijo` (`github.com/ardyniech/Drg-ijo`)
- **Sifat dokumen:** Rencana kerja, bukan read-only audit. Menggantikan/menyempurnakan `docs/AUDIT-2026-10-12.md` (yang sudah usang, menilai `23799b62` sebelum pivot Firebase).
- **Cara pakai:** kerjakan berurutan sesuai prioritas P0 → P3. Setiap perubahan wajib lulus gerbang verifikasi (§6).

---

## 1. Ringkasan Eksekutif

DRG App saat ini berisi **tiga tumpukan backend yang saling tumpang tindih dan tidak terhubung**:

1. **LocalStorage mock "Supabase"** (`src/integrations/supabase/*`) — inilah yang sebenarnya dipakai seluruh UI. `@supabase/supabase-js` tidak pernah di-import.
2. **Firebase/Firestore + FCM** (`server/firebase-admin.ts`, `src/routes/api.*`, `src/hooks/use-auth.ts`, `use-push.ts`) — kode nyata dan cukup matang, **tetapi tidak dipanggil UI**. SOS tetap menulis ke localStorage, bukan `/api/incidents`.
3. **Sisa Supabase/Postgres** (`server/migrations/*.sql`, ARG `VITE_SUPABASE_*` di Dockerfile & deploy/) — mati.

Akibatnya: klaim README/ROADMAP ("Server-Backed Firebase", "sync terintegrasi penuh", "realtime") **tidak sesuai kode**; ada **backdoor privilege**, **IDOR/PII leak**, endpoint realtime & sync yang **tidak berfungsi**, serta **CI merah** dan tak ada deployment nyata.

Kabar baik: `bun run test` **149/149 lolos**, Firestore rules sudah server-only untuk write incident, dan struktur modul frontend rapi. Fondasinya ada — yang dibutuhkan adalah **keputusan arsitektur** lalu **menyatukan, mengamankan, dan mengoperasionalkan**.

---

## 2. Keputusan Arsitektur (P0 — memblokir item lain)

> **KEPUTUSAN PEMILIK — 2026-10-12:**
> - **Arsitektur:** *Local-First UI + Firebase sebagai server otoritatif* (Opsi 1). LocalStorage = cache/offline store + outbox; Firebase Auth & Firestore = sumber kebenaran.
> - **Bootstrap admin:** **Hapus** aturan "user pertama = super_admin"; admin pertama ditetapkan lewat skrip CLI (`bun run admin:grant`, memakai `FIREBASE_SERVICE_ACCOUNT`). Tanpa secret fallback.

**Rekomendasi: Local-First UI + Firebase sebagai server otoritatif (sesuai `docs/ARCHITECTURE.md` §2 dan README §Fitur 3).**

- LocalStorage = **cache/offline store + outbox** (bukan sumber kebenaran untuk data bersama).
- Firebase Auth = identitas & klaim role (custom claims) → satu-satunya sumber role.
- Firestore = sumber kebenaran data bersama (insiden, users, kas, roles, satgas_devices).
- Nama modul `src/integrations/supabase/*` → ganti/rename menjadi `src/integrations/local-store/*` (atau hapus dependensi `@supabase/supabase-js`). Jangan biarkan "Supabase" yang menyesatkan.
- Hapus seluruh sisa Postgres/Supabase (migrasi `.sql`, ARG Docker, dokumen deploy).

**Alternatif (jika memilih balik ke PostgreSQL/Supabase native):** base commit `ee60dbb9` sudah tak relevan — bongkar total dari nol. Tidak direkomendasikan karena menunda pengiriman nilai dan memboroskan kerja Firebase yang sudah ada.

> Tanpa keputusan ini, item P1 di area lain hanya menambah tumpukan keempat.

---

## 3. Temuan & Rekomendasi per Area

### 3.1 Keamanan & Autentikasi — **KRITIS**

| ID | Temuan | Bukti | Dampak |
| :-- | :-- | :-- | :-- |
| S1 | **Backdoor bootstrap-admin** dengan secret fallback hardcoded; siapa pun bisa menjadikan UID apa pun `super_admin` + `verified_member`. Memakai `VITE_` di server route. | `src/routes/api.auth.ts:71-87`, `:74` | Eskalasi privilege penuh tanpa autentikasi |
| S2 | **IDOR / PII leak incident** — `idempotencyKey` dari klien dipakai langsung sebagai doc ID; saat tabrakan mengembalikan `existingIncident.data()` milik user lain (nama, telepon, GPS). | `src/routes/api.incidents.ts:51,75,141` | Kebocoran lintas pengguna |
| S3 | **Autentikasi client-authoritative** — bcrypt+salt di localStorage (bisa dimanipulasi), token sesi unsigned, **user pertama otomatis super_admin**, migrasi role dari localStorage. | `modules/auth/logic/local-auth-client.ts:98,105`; `local-auth-store.ts:56`; `client-migration-helper.ts:20` | Siapa pun bisa jadi super_admin |
| S4 | **AI proxy publik tanpa auth/rate limit**; prompt injection (input user diinterpolasi mentah); model `"gemini-3.8-flash"` tidak valid → selalu jatuh ke fallback. | `src/routes/api.ai.dispatch.ts:31-39,67` | Penyalahgunaan biaya API & kualitas |
| S5 | **FMC device registration tanpa cek role** & doc-ID tidak konsisten (`substring(0,16)` vs `substring(0,32)`), plus token mock `"mock-fcm-token-…"` ditulis ke koleksi produksi. | `api.fcm.register.ts:36`; `use-push.ts:54,57` | Spam push ke anggota biasa, data kotor |
| S6 | **Rate-limit insiden hanya lunak** (menandai `aktif_berulang` tapi tetap menulis); FCM blast ke **semua** device tanpa filter role. | `api.incidents.ts:62-71,112` | Banjir insiden/push |
| S7 | **Error ke klien membocorkan `e.message`** internal. | `api.incidents.ts:146,219`; `api.auth.ts:91` | Information disclosure |
| S8 | **`.env.example` hanya berisi `GEMINI_API_KEY` & `GITHUB_TOKEN`**; tak ada variabel Firebase/VAPID/bootstrap. Sevice secrets server memakai prefix `VITE_`. | `.env.example:1-8`; `server/firebase-admin.ts:7-26` | Setup gagal & risiko secret bocor ke bundle |
| S9 | **Firestore rules tidak lengkap** (hanya incidents/logs/users/rate_limits/satgas_devices); `satgas_devices` delete error; tak ada syarat `verified_member` untuk read insiden. | `firestore.rules:65` | Batas keamanan tidak konsisten |

**Rekomendasi (P0/P1):**
1. **Hapus `bootstrap-admin`** dari route, atau jadikan skrip CLI satu-kali yang memakai `FIREBASE_SERVICE_ACCOUNT` + cek allowlist; **tidak ada secret fallback**. Pindahkan semua secret server ke env non-`VITE_`.
2. **Jangan pakai input klien sebagai doc ID.** Server membuat doc ID (ULID/UUID) dan menyimpan `idempotencyKey` sebagai field dengan unique-index; collision → cek `userId === auth.uid` sebelum mengembalikan data.
3. **Autentikasi server-otoritatif:** Firebase Auth + custom claims sebagai sumber tunggal. Tetapkan admin pertama lewat skrip/env, bukan "user pertama". Hapus jalur migrasi role dari localStorage.
4. **Lindungi `/api/ai/dispatch`** dengan verifikasi token + rate limit per-uid; larang prompt injection (whitelist kategori, batasi panjang); perbaiki nama model + fallback yang menyimpan kategori asli.
5. **Batasi device FCM ke `satgas`/`korlap`**; samakan skema doc-ID dengan server; hapus token mock.
6. **Rate limit keras** pada pembuatan insiden; filter penerima FCM per wilayah/role.
7. Jangan kembalikan pesan error mentah; gunakan kode error generik + log server.
8. Lengkapi `.env.example` (semua `VITE_FIREBASE_*`, `FIREBASE_*`, `VITE_FIREBASE_VAPID_KEY`) dan dokumen rotasi.

### 3.2 API & Backend

| ID | Temuan | Bukti | Rekomendasi |
| :-- | :-- | :-- | :-- |
| A1 | `/api/incidents` (228 baris) & `/api/auth` tidak dipanggil UI; SOS pakai localStorage. | `modules/kejadian/storage/kejadian-storage.ts:9` | Wire UI ke API (P1) setelah keputusan §2 |
| A2 | `/api/realtime` **rusak total**: `EventSource` tak bisa kirim Bearer (selalu 401), `broadcast()` POST ke endpoint tanpa handler POST, stream hanya 1 heartbeat. | `api.realtime.ts:9-28`; `core/realtime/realtime-channel.ts:40,55` | Ganti ke Firestore `onSnapshot`, atau autentikasi via cookie/query token + handler POST nyata |
| A3 | `/api/sync` **stub**: GET selalu `changes: []`, POST hanya echo. Worker klien juga **tak mengirim `Authorization`** → 401. | `api.sync.ts:38,77`; `core/sync/use-outbox-worker.ts:36` | Implementasi persist outbox→Firestore + tarik perubahan; perbaiki header auth |
| A4 | `/api/incidents` melebihi batas 125 baris (SOP v4); validasi input kurang (panjang, range lat/long, enum kategori). | `api.incidents.ts` (228) | Pecah handler; Zod diperketat |
| A5 | `/api/health` publik tanpa masalah berarti (minor fingerprinting uptime). | `api.health.ts` | Opsional: hapus `uptime` |
| A6 | Tak ada `firebase.json` → rules/indexes tidak bisa `firebase deploy`. | — | Tambahkan config deploy |

### 3.3 Data Layer, Sync & Realtime

| ID | Temuan | Bukti | Rekomendasi |
| :-- | :-- | :-- | :-- |
| D1 | Adapter "Supabase" sebenarnya localStorage; query builder mengabaikan `select/order/limit/where` (selain `eq` pada 2–3 kolom). | `integrations/supabase/local-query-builder.ts:14-95` | Rename & dokumentasikan sebagai local store; implementasi filter yang benar atau pindah ke Firestore SDK |
| D2 | Data bersama (kas, insiden, piket, screening) tersimpan per-browser → **tak ada data lintas pengguna** meski UI mengesankan sebaliknya. | `local-table-resolvers.ts`, `local-tx-store.ts` | Pindahkan entitas bersama ke Firestore; localStorage hanya cache |
| D3 | Outbox nyata & teruji tetapi selalu gagal kirim (A3). | `core/sync/*` | Setelah A3, pastikan auto-flush saat startup (bukan hanya event `online`) |
| D4 | `server/migrations/*.sql` (Postgres) tidak pernah dijalankan; menyesatkan. | `server/migrations/001,002` | Hapus (setelah §2 = Firebase) |
| D5 | Migrasi localStorage ada sistem sendiri (`LATEST_TARGET_VERSION=3`) — berjalan, tapi terpisah dari migrasi server. | `core/migrations/*` | Dokumentasikan sebagai migrasi cache klien |

### 3.4 Frontend & Kesehatan Kode

| ID | Temuan | Bukti | Rekomendasi |
| :-- | :-- | :-- | :-- |
| F1 | **Kode mati**: `src/lib/auth-service.ts`, `firebase-auth-client.ts`, `hooks/use-auth.ts`, `lib/firebase.ts`, `client-migration-helper.ts`, `src/App.tsx`, `components/live-map.tsx`, `shared/utils/sw-register.ts`, `shared/utils/geo-distance.ts`, `modules/about/data/branches-*.ts`, `anggota/storage/anggota-storage.ts`. | grep tanpa import | Hapus semua; ini menghilangkan 1 pelanggaran 125-baris |
| F2 | `firebase.ts` vs `firebase-client.ts` **duplikat** config + **fallback mock**. | keduanya `:6-12` | Satukan ke satu modul; fail-fast bila env hilang (jangan fallback mock) |
| F3 | **Bug** `use-auth.ts:30` `getIdResult()` (API: `getIdTokenResult()`) → profil user selalu null. | `hooks/use-auth.ts:30` | Perbaiki atau hapus (kemungkinan mati → F1) |
| F4 | `__root.tsx` **subscribe auth dua kali** (LocalAuth + supabase yang delegasi ke LocalAuth) → invalidasi ganda; `fallbackQueryClient` redundan; registrasi SW inline padahal ada `sw-register.ts`. | `routes/__root.tsx` | Dedup langganan; pakai `sw-register.ts` |
| F5 | Pola baca/tulis localStorage diimplementasi ulang di ~8 modul storage, bukan lewat `shared/utils/safe-storage.ts`. | `*-storage.ts` | Konsolidasikan |
| F6 | Pelanggaran 125 baris: `api.incidents.ts` (228), `dashboard/widgets/driver-dashboard-widget.tsx` (129), `routes/_authenticated/dashboard.tsx` (127), `lib/auth-service.ts` (127, mati). | `scripts/code-health-audit.mjs` | Pecah; hapus yang mati |
| F7 | Tipe: `local-query-builder.ts` pakai `any` + satu-satunya `eslint-disable`; `tsc --noEmit` menghasilkan ~20 error (banyak dari commit Firebase: `api.incidents.ts`, `api.auth.ts`, `vite.config.ts`; sisanya piket/profil/screening/kas). | `npx tsc --noEmit` | Jadikan typecheck hijau sebagai gate (lihat §6) |

### 3.5 Pengujian

| ID | Temuan | Bukti | Rekomendasi |
| :-- | :-- | :-- | :-- |
| T1 | **Uji route/server bohong** — `api.incidents.test.ts`, `api.fcm.test.ts`, `server/incident.test.ts` menyalin ulang skema/​logika, tidak meng-import handler nyata. | ketiga file | Impor handler asli; uji lewat request mock |
| T2 | `firestore.rules.test.ts` di root **tak match glob vitest** → tidak pernah jalan; butuh emulator. | `vitest.config.ts` include `src/**` | Pindahkan ke `src/` atau tambah project vitest + jalankan emulator di CI |
| T3 | Modul tanpa uji bermakna: `daftar`, `dashboard`, `landing`, `onboarding` (placeholder). | tests | Ganti dengan uji nyata |
| T4 | `code-health-audit.mjs` hanya cek keberadaan folder `tests/` → klaim "semua modul teruji" meski ada kode mati & uji palsu. | `scripts/code-health-audit.mjs` | Tambah deteksi importer/kode mati & uji yang meng-import modul |
| T5 | Jumlah uji di dokumen usang (ROADMAP "22 file/60 test"; AUDIT "133 test") vs nyata 49 file/149 test. | docs | Selaraskan angka dari hasil `bun run test` |

### 3.6 CI/CD & Deployment — **TINGGI**

| ID | Temuan | Bukti | Rekomendasi |
| :-- | :-- | :-- | :-- |
| C1 | **CI merah**: `npm ci` gagal karena `package-lock.json` tidak sinkron (firebase, firebase-admin, @google/genai, @firebase/* hilang). | `.github/workflows/ci.yml:29`; `package-lock.json` | Pilih satu package manager (bun), regenerasi lock, ubah CI ke `bun install --frozen-lockfile` |
| C2 | **Deploy stub**: `deploy.yml` hanya build Docker `push:false`, tak mendeploy ke mana pun. | `.github/workflows/deploy.yml` | Tentukan target nyata (Coolify / Vaio) dan sambungkan |
| C3 | Target deployment terfragmentasi & usang: Dockerfile/nixpacks/Coolify + Vaio systemd + klaim "Cloud Run" (tak ada config). ARG `VITE_SUPABASE_*` masih ada. | `Dockerfile`, `deploy/**`, `nixpacks.toml` | Pilih **satu** target; perbarui env ke Firebase; hapus referensi Supabase |
| C4 | **Tidak ada service systemd** untuk app ini; `service-map.md` mencatat DRG hanya sebagai *archived*; tak ada listener di :3000. | `~/.config/systemd/user/`, `/home/ardy/docs/02-operations/service-map.md` | Bila ingin dijalankan di host ini: buat unit user sesuai AGENTS.md (bind Tailscale `100.117.176.41`, `CPUQuota`/`MemoryMax`), daftarkan di service-map |
| C5 | `package.json` `name` masih `tanstack_start_ts`; build `.output/` lebih tua dari HEAD. | `package.json:2`, `.output/` | Rename; rebuild |

### 3.7 Dependencies & Konfigurasi

- **Dependensi mati:** `@supabase/supabase-js`, `@block65/webcrypto-web-push`, `@lovable.dev/cloud-auth-js` — tak ada import. Hapus.
- **Dua lockfile** (`package-lock.json` usang + `bun.lock`) → sumber C1. Pertahankan `bun.lock` saja.
- `vite.config.ts` CSP kontradiktif: `frame-ancestors 'self' *` (invalid) — perbaiki.
- `vite.config.ts:11` error `tsc` (`server` bukan properti opsi Lovable) — sesuaikan tipe/plugin.
- `metadata.json` mengklaim `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` — validasi kebenarannya.

### 3.8 Dokumentasi & PWA

- **README**: hapus klaim "Supabase Mock", "Cloud Run", dan akun demo (`ketua@drg.id`) yang tak berlaku lagi di Firebase Auth; jelaskan arsitektur Firebase + local cache; tambah setup env Firebase.
- **ROADMAP**: tandai jujur — Phase 2 sync/realtime belum nyata (stub); sesuaikan angka uji.
- **ARCHITECTURE.md**: perbarui nama adapter, tambah rute `/koperasi`, `/pengaturan`, `/activity-log`, `/screening`, bagian Firebase.
- **PWA**: `public/firebase-messaging-sw.js` **hardcode mock config** (`AIzaSyMockKey…`) → service worker tak akan cocok dengan project nyata. Perlu injeksi config saat build. `public/sw.js` sudah punya handler `push`/`notificationclick`.
- `deploy/README.md`, `deploy/COOLIFY.md` masih instruksi Supabase → perbarui/hapus.
- Perbarui `docs/AUDIT-2026-10-12.md` atau tandai superseded oleh dokumen ini.

---

## 4. Peta Prioritas

| Prioritas | Item | Area |
| :-- | :-- | :-- |
| **P0** | Keputusan arsitektur (§2) | Arsitektur |
| **P0** | S1 backdoor bootstrap-admin | Keamanan |
| **P0** | S3 autentikasi client-authoritative ("user pertama = super_admin") | Keamanan |
| **P0** | C1 CI hijau (lockfile/satu package manager) | CI/CD |
| **P1** | S2 IDOR incident; S4 AI proxy; S5/S6 FCM & rate limit; S7 error leak | Keamanan |
| **P1** | A2 realtime, A3 sync (atau tandai eksperimental & nonaktifkan UI-nya) | Backend |
| **P1** | D1/D2 satukan data bersama ke Firebase; rename adapter | Data |
| **P1** | F1/F2/F3 hapus kode mati & duplikat; perbaiki/hapus `use-auth` | Frontend |
| **P1** | C3/C4 tetapkan target deploy & ops; wire deploy | Ops |
| **P1** | S8/.env + 3.8 dokumentasi & messaging SW | Config/Docs |
| **P2** | T1/T2 uji nyata + rules test jalan; T4 audit script | Testing |
| **P2** | F4 `__root` dedup; F5 konsolidasi storage; F6 pecah >125 | Kesehatan kode |
| **P2** | A4 validasi input & split `api.incidents.ts`; A6 `firebase.json` | Backend |
| **P2** | C5 rename package; 3.7 hapus deps mati; CSP & vite tipe | Config |
| **P3** | S9 lengkapi Firestore rules lain; A5 health hardening | Keamanan |
| **P3** | F7 jadikan `tsc --noEmit` bersih total | Kualitas |
| **P3** | Roadmap Phase 3 (Koperasi/QRIS) setelah fondasi stabil | Produk |

---

## 5. Rencana Eksekusi Bertahap

**Sprint 0 — Fondasi & Keamanan (P0) — ✅ SELESAI (2026-10-12)**
1. Putuskan arsitektur (§2) & tulis ADR singkat di `docs/ARCHITECTURE.md`. ✅ (keputusan dicatat §2)
2. Hapus backdoor bootstrap-admin; tetapkan admin pertama via skrip env. ✅ (`api.auth.ts` + `scripts/grant-admin.ts`)
3. Hentikan "user pertama = super_admin"; samakan identitas ke Firebase Auth. ✅ (`local-auth-client.ts`: sign-up selalu `anggota`/`calon`)
4. Perbaiki CI: satu package manager (bun), regenerasi lock, `bun install --frozen-lockfile`, jalankan `tsc`, `lint`, `test`, `build`. ✅ (`.github/workflows/ci.yml` → bun; `src/vite-env.d.ts`)
5. **Gate:** CI hijau; app tetap build & 149 test lolos. ✅ (tsc 0 error; lint 0 error; 149/149 test; build sukses)
   - Bonus: 84→0 error `tsc`, `eslint --fix` merapikan format ~10 berkas Firebase lama.

   > Sisa yang **belum** dikerjakan dari Sprint 0 dan dilacak terpisah: rute `/verifikasi/$token` & `/status/$token` belum ada (link di `daftar-success-view` sementara diubah ke `<a>` agar tipe bersih, tetap 404). Implementasi rute = fitur, masuk Sprint 3/4.

**Sprint 1 — Kekuatan Backend (P1) — ✅ SELESAI (2026-10-12)**
6. Perbaiki IDOR insiden (server-generated ID + cek pemilik). ✅ (`incident-service.ts`: advisori idempotency owner-scoped)
7. Amankan AI dispatch. ✅ (`api.ai.dispatch.ts`: Bearer auth + verified/role gate + rate limit 20/menit; `new GoogleGenAI({ apiKey })`; model `GEMINI_MODEL` default `gemini-2.5-flash`; fallback mempertahankan kategori/lokasi; klien kirim ID token)
8. Batasi FCM per role, hapus token mock, samakan doc-ID. ✅ (`api.fcm.register.ts` role-gate satgas/korlap/admin/super_admin, tolak `mock-fcm-token`, doc-ID `<uid>_<token[:16]>`; `use-push.ts` tanpa token mock + daftar via API)
9. Rate limit keras insiden. ✅ (`incident-rules.ts`: 5/menit → 429)
10. Bersihkan kebocoran error. ✅ (pesan generik di insiden/FCM/AI)
11. Implementasi sync & realtime. ✅ (keputusan: relabel + hentikan ack palsu)
    - Realtime: `src/core/realtime/*` + `api.realtime.ts` = **kode mati** (0 referensi) → hapus di Sprint 2 (F1). Tidak diimplementasikan.
    - Sync: header `Authorization` ditambahkan + auto-flush saat startup (`use-outbox-worker.ts`). `/api/sync` POST tidak lagi meng-`ack` operasi yang tidak dipersist → balas **501**; badge diubah dari klaim "SOS Server Active" menjadi **"Mode Lokal"** yang jujur.
    - **Gate:** tsc 0 error; lint 0 error (5 warning lama); 154/154 test; build sukses.

**Sprint 2 — Persatuan Data & Pembersihan (P1/P2)**
12. Rename adapter local store & hapus `@supabase/supabase-js`/migrasi SQL. 13. Pindahkan entitas bersama ke Firestore, localStorage = cache. 14. Hapus semua kode mati (F1) & duplikat firebase (F2). 15. Perbaiki `__root.tsx` & konsolidasi storage.

**Sprint 3 — Kualitas & Operasional (P2)**
16. Uji nyata untuk handler & modul kosong; jalankan rules test (T1/T2/T4). 17. Pecah file >125 baris; `tsc --noEmit` bersih. 18. Tetapkan target deploy tunggal, perbarui Dockerfile/nixpacks/env, wire `deploy.yml`. 19. (Opsional) unit systemd user + daftar di service-map.

**Sprint 4 — Dokumentasi & Produk (P2/P3)**
20. Selaraskan README/ROADMAP/ARCHITECTURE, tambah `firebase.json`, perbaiki messaging SW. 21. Lanjut Phase 3 (Koperasi/QRIS) di atas fondasi yang sudah bersih.

---

## 6. Definition of Done / Gerbang Verifikasi

Setiap PR wajib lulus:

```bash
cd /home/ardy/projects/Drg-ijo
bun install --frozen-lockfile
bun x tsc --noEmit      # target: 0 error (lihat F7)
bun run lint            # 0 error
bun run test            # 149+ lolos, tanpa uji tautologis
bun run build           # sukses
```

Ditambah gerbang keamanan: tidak ada secret fallback di kode, tidak ada secret prefix `VITE_` untuk penggunaan server, `.env.example` lengkap, dan `firestore.rules` + test-nya dieksekusi.

---

## 7. Catatan

- Dokumen ini mengiringi pelaksanaan; perubahan kode per-sprint dicatat di git.
- `docs/AUDIT-2026-10-12.md` tetap dipertahankan sebagai jejak, tetapi sebagian temuannya (push/Firebase) sudah tidak relevan pasca `bd46cdbc`.
- Keputusan §2 **sudah diambil** (2026-10-12) — lihat blok keputusan di §2. Selanjutnya: tetapkan target deployment (C3/C4) sebelum Sprint 3.
