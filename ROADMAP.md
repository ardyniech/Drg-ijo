# 🗺️ DRG App — Project Roadmap & Milestones

Dokumen roadmap ini merinci arah pengembangan, tonggak pencapaian (_milestones_), dan status aktual implementasi fitur untuk platform **DRG Community App (Driver Riang Gembira)** berpedoman pada **SOP Arsitektur & Coding v4.0**.

---

## 📌 Status & Visi Pengembangan

DRG App dibangun dengan filosofi **"Simplicity is King"**, **Local-First Architecture**, **Transparansi Status Sinkronisasi**, dan **Zero Bloat**. Seluruh modul terisolasi rapi (_Hub-and-Spoke_), teruji unit test secara ketat, dan mematuhi batas maksimal $\le 125$ baris per berkas kustom.

```
[Phase 1: Core Foundation] ➔ [Phase 2: Local-First, PWA & RBAC] ➔ [Phase 3: Finansial & Koperasi] ➔ [Phase 4: Telemetri & AI]
        (SELESAI - STABIL)                 (SELESAI - STABIL)                (TARGET: Q1-Q2 2027)            (TARGET: Q3 2027+)
```

---

## 🚀 Phase 1: Core Modular Foundation (Q1–Q2 2026) — ✅ _STABLE / COMPLETED_

Fokus pada modularisasi arsitektur kode, manajemen keanggotaan dasar, dan operasional lapangan primer.

- [x] **Hub-and-Spoke Modular Codebase**:
  - Standar ketat $\le 125$ baris per file untuk seluruh UI components, controllers, dan hooks.
  - Arsitektur modular di `src/modules/` (`auth`, `dashboard`, `kas`, `piket`, `profil`, `screening`, `anggota`).
- [x] **Autentikasi & Sesi Mandiri**:
  - `LocalAuthClient` mandiri tanpa kebocoran kredensial di antarmuka publik.
  - Proteksi route guard `/_authenticated` dengan verifikasi sesi instan dan redirect aman.
- [x] **Peta Live & Telemetri On-Bit**:
  - Integrasi Leaflet dengan visualisasi status online/offline pengemudi di pangkalan dan koordinat GPS.
- [x] **Pencatatan Kas Sosial & Ekspor Struk**:
  - Tracking mutasi kas, status iuran 3-tier (_Aktif, Menunggak, Kritis_), dan modal bukti transfer/struk.
- [x] **Jadwal Piket Satgas & Shift Swapping**:
  - Kalender piket mingguan, pengajuan tukar shift, dan kalkulator selisih hari.
- [x] **Skrining Anggota & Ekspor CSV**:
  - Kuesioner penerimaan anggota baru dengan validasi data dan ekspor spreadsheet terstandarisasi.

---

## ⚡ Phase 2: Local-First Sync, PWA & Tata Kelola Organisasi (Q3–Q4 2026) — ✅ _STABLE / COMPLETED_

Fokus pada keandalan offline saat driver di jalan, sistem tanggap darurat, tata kelola organisasi resmi, dan audit transparansi.

- [x] **M2.1: Centralized Outbox Pattern & Sync Engine (`src/core/sync/`)**:
  - Antrean mutasi terisolasi (`drg_outbox_queue_v1`) dengan idempotency key dan FIFO processing.
  - Worker otomatis yang memproses antrean saat koneksi online pulih dengan *retry backoff*.
  - Indikator transparansi sinkronisasi di header (`SyncStatusBadge`): *Tersinkronisasi*, *Tersimpan Lokal: X pending*, dan *Offline*.
  - Terintegrasi penuh pada mutasi Kas, Sinyal SOS, Verifikasi Akun, Inventaris Posko, dan Peran Pengurus.
- [x] **M2.2: Sticky Emergency SOS Broadcast Alert & Web Audio Chime**:
  - Banner darurat permanen di `_authenticated/route.tsx` saat ada insiden aktif di lapangan.
  - Sintesis audio darurat berbasis native *Web Audio API* (880Hz/440Hz dual-tone) tanpa dependensi file eksternal.
  - Aksi tanggap darurat cepat: direct radar view, kontak telepon korban, dan kontrol audio mute/dismiss.
- [x] **M2.3: Native Progressive Web App (PWA) & Guided Installation**:
  - Intersepsi event `beforeinstallprompt` dan deteksi mode standalone.
  - Dialog panduan instalasi visual 3-langkah untuk pengguna iOS Safari (Add to Home Screen).
- [x] **M2.4: Dynamic Role-Based Access Control (RBAC) & Struktur Kepengurusan**:
  - Hierarki peran lengkap: `super_admin`, `ketua`, `sekretaris`, `bendahara`, `korlap`, `satgas`, `dewan_etik`, `driver`, `anggota`.
  - Generator nomor SK Kepengurusan otomatis dan pencatatan audit log mutasi peran.
- [x] **M2.5: Disaster Recovery & Data Backup / Restore Hub**:
  - Ekspor seluruh basis data lokal dalam berkas arsip `.json` terstruktur dengan checksum verifikasi.
  - Validasi ketat pemulihan data untuk mencegah korupsi format atau data kosong.
- [x] **M2.6: Modul Tata Kelola Lengkap Tambahan**:
  - **Dewan Etik (`src/modules/etik/`)**: Penanganan pelanggaran, sidang kode etik, dan penerbitan SK Sanksi/Pembinaan.
  - **Kaderisasi & Penilaian (`src/modules/kaderisasi/`)**: Jenjang keanggotaan (Pratama, Madya, Utama) dan evaluasi loyalitas.
  - **Notulen Musyawarah (`src/modules/notulen/`)**: Dokumentasi rapat resmi, daftar hadir, dan arsip keputusan organisasi.
  - **Inventaris Posko Satgas (`src/modules/inventaris/`)**: Peminjaman dan pengembalian perlengkapan darurat (rompi, HT, jas hujan).
  - **Verifikasi Calon Anggota (`src/modules/persetujuan/`)**: Alur persetujuan berkas pendaftaran dan validasi kendaraan.
  - **Activity Log & Audit Trail (`src/modules/activity-log/`)**: Riwayat linimasa seluruh tindakan operasional pengurus.
- [x] **M2.7: Comprehensive Automated Testing**:
  - 22 file pengujian unit Vitest dengan **60 tests lolos 100%**.
  - ESLint 0 error dan kompilasi build bersih.

---

## 💰 Phase 3: Koperasi Digital & Financial Ecosystem (Q1–Q2 2027) — 📋 _PLANNED_

Fokus pada penguatan kemandirian ekonomi pengemudi, sistem simpan pinjam, dan otomatisasi iuran pangkalan.

### Milestones & Target Deliverables

1. **M3.1: Pembayaran Iuran Otomatis via QRIS Dinamis** — _Januari 2027_
   - Pembuatan kode QRIS unik per tagihan iuran kas dengan pencocokan status otomatis.
2. **M3.2: Modul Koperasi Simpan Pinjam (SP-DRG)** — _Maret 2027_
   - Buku besar simpanan pokok, simpanan wajib, dan alur pengajuan pinjaman darurat anggota terverifikasi.
3. **M3.3: Automated Financial Reporting & Laporan Pertanggungjawaban (LPJ)** — _Mei 2027_
   - Generator laporan keuangan bulanan otomatis berformat PDF & Spreadsheet lengkap dengan diagram arus kas.
4. **M3.4: Approval Berjenjang Pengeluaran Kas (Multi-Sign)** — _Juni 2027_
   - Persetujuan digital dua pintu (Bendahara ➔ Ketua) untuk pengeluaran anggaran di atas ambang batas tertentu.

---

## 🤖 Phase 4: AI Dispatching & Predictive Safety Intelligence (Q3 2027+) — 🔮 _FUTURE_

Fokus pada keselamatan preventif di jalan raya melalui telemetri pintar dan otomatisasi respons pangkalan.

### Milestones & Target Deliverables

1. **M4.1: Smart Incident Dispatcher Engine**
   - Algoritma rekomendasi otomatis satgas terdekat berdasarkan radius GPS dan ketersediaan unit On-Bit.
2. **M4.2: Peta Zona Rawan (Hazard Heatmap)**
   - Peringatan audio/visual saat rute pengemudi mendekati titik rawan begal, kecelakaan berulang, atau genangan banjir.
3. **M4.3: Hands-Free Voice SOS Trigger**
   - Aktivasi sinyal SOS darurat melalui komando suara tanpa menyentuh layar saat kedua tangan berada di kemudi.
4. **M4.4: Telemetri Kelelahan & Pengingat Istirahat**
   - Deteksi durasi aktif On-Bit berlebih (> 8 jam) disertai rekomendasi posko/pangkalan rehat terdekat.

---

## 📊 Ringkasan Timeline Rilis

| Milestone  | Target Periode |     Status      | Fokus Utama                                                                   |
| :--------- | :------------- | :-------------: | :---------------------------------------------------------------------------- |
| **v1.0.0** | Q2 2026        |    ✅ Rilis     | Core Hub-and-Spoke, Auth, SOS, Kas, Piket                                     |
| **v1.1.0** | Q3 2026        |    ✅ Rilis     | Outbox Sync Pattern, PWA Install, Web Audio SOS Banner, Backup-Restore, RBAC  |
| **v1.2.0** | Q4 2026        |    ✅ Rilis     | Modul Etik, Kaderisasi, Notulen, Inventaris Posko, Persetujuan Akun           |
| **v2.0.0** | Q1 2027        |  📋 Terjadwal   | Koperasi Digital, QRIS Iuran, & Otomatisasi LPJ Keuangan                      |
| **v2.5.0** | Q3 2027+       |    🔮 Riset     | AI Dispatching, Hazard Heatmap Telemetry, & Voice SOS                         |

---

## 🤝 Kontribusi Roadmap

Usulan penambahan fitur atau penyesuaian prioritas dapat dibahas melalui forum musyawarah pengurus atau pelaporan resmi komunitas.
