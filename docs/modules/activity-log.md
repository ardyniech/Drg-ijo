# Dokumentasi Modul: Activity Log & Audit Trail

## 1. Ikhtisar Utama
Modul **Activity Log & Audit Trail** (`src/modules/activity-log`) menyediakan mekanisme pencatatan riwayat tindakan transparan lintas peran (*cross-role activity tracking*) di seluruh sistem DRG App. Modul ini mencatat setiap aktivitas penting yang dilakukan oleh pengurus maupun anggota untuk menjamin akuntabilitas dan transparansi penuh.

---

## 2. Struktur Data (`ActivityLogEntry`)

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | `string` | ID unik log (format `act-<timestamp>`) |
| `actorId` | `string` | ID pengguna pemrakarsa tindakan |
| `actorName` | `string` | Nama lengkap pemrakarsa tindakan |
| `actorRole` | `UserRole` | Jabatan/peran pemrakarsa (`ketua`, `sekretaris`, `bendahara`, `admin`, `satgas`, `dewan_etik`, `anggota`) |
| `action` | `string` | Nama tindakan (contoh: *Pengesahan SK Pengurus*, *Approval Pencairan Kas*) |
| `module` | `ActivityModule` | Modul terkait (`roles`, `kas`, `kejadian`, `piket`, `notulen`, `etik`, `persetujuan`) |
| `description` | `string` | Rincian lengkap/kronologi tindakan |
| `timestamp` | `string` | Waktu tindakan dalam format ISO string |

---

## 3. Komponen Utama & Integrasi

1. **`getActivityLogs` / `recordActivityLog` (`storage/activity-log-storage.ts`)**:
   - Fungsi pembaca dan perekam entri log ke `localStorage` dengan penanganan fallback memori jika di lingkungan pengujian Node.js.
2. **`useActivityLogs` (`logic/use-activity-logs.ts`)**:
   - Custom hook TanStack Query yang mengelola pencarian, penyaringan berdasarkan rute/modul, dan invalidasi cache otomatis.
3. **`ActivityLogView` (`primitives/activity-log-view.tsx`)**:
   - Tampilan feed audit trail dengan badge role berwarna, ikon modul (*Roles, Kas, Kejadian, Etik, Notulen, Persetujuan*), dan stempel waktu.
   - Dipasang langsung di bagian bawah halaman **Dashboard Utama (`/dashboard`)**.

---

## 4. Panduan Developer

- **Lokasi Kode**:
  - `src/modules/activity-log/types.ts`
  - `src/modules/activity-log/storage/activity-log-storage.ts`
  - `src/modules/activity-log/logic/use-activity-logs.ts`
  - `src/modules/activity-log/primitives/activity-log-view.tsx`
  - `src/modules/activity-log/tests/activity-log.test.ts`
