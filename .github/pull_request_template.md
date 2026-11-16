## Deskripsi Perubahan (PR Description)
Ringkasan singkat apa yang diubah/ditambahkan dan alasan perubahan ini.

- **Tipe Perubahan:** [ ] Fitur Baru | [ ] Perbaikan Bug | [ ] Refaktor | [ ] Dokumentasi / CI
- **Modul Terkait:** `src/modules/[module_name]` atau `src/core/`
- **Issue Terkait:** Fixes #

---

## Peran & Tanggung Jawab (Team Roles)
- **Penulis (Author):** @
- **Peninjau (Reviewer):** @
- **Persetujuan Admin (Admin Approver):** @ (Wajib untuk perubahan core/config)

---

## Checklist Kepatuhan SOP v4.0
- [ ] **Batas Baris File:** Tidak ada file yang melebihi 125 baris (atau 200 baris untuk config/entrypoint).
- [ ] **Single Responsibility:** Setiap file hanya memiliki satu tanggung jawab jelas.
- [ ] **Tanpa Magic Value:** Semua token warna, ukuran, dan animasi mengacu pada tema.
- [ ] **Tema Terang (Light Theme):** Tidak ada dark theme monolitik; palet hangat/berlapis.
- [ ] **Unidirectional Data Flow:** UI hanya emit event dan membaca immutable state.
- [ ] **Zero Cross-Module Import:** Komunikasi antar-modul hanya melalui dispatcher atau shared models.
- [ ] **Bukti Pengujian & Negatif Audit:**
  - [ ] Bad input ditangani (null, data kosong, format keliru).
  - [ ] Cross-module failure aman (fallback transparan, tanpa silent failure).
  - [ ] UI dead-end dicegah (indikator offline/retry tersedia).

---

## Bukti Pengujian (Test Evidence)
```bash
npm run test     # Lampirkan output pengujian
npm run lint     # Pastikan 0 linter errors
npm run build    # Pastikan build produksi berhasil
```

---

## Catatan untuk Peninjau (Notes for Reviewers)
Hal-hal penting atau instruksi khusus saat mereview perubahan ini.
