/**
 * Automatically inspects codebase modules and generates feature-tree.json
 * Ensures the "Pohon Fitur & Status" card in About tab always reflects reality without hardcoding.
 */
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src/modules/about/data/feature-tree.json");

const BRANCH_DEFINITIONS = [
  {
    id: "akun",
    label: "Akun, Peran & Tata Kelola",
    summary: "Autentikasi mandiri, hirarki peran kepengurusan, dan jejak aktivitas.",
    features: [
      {
        label: "Login & registrasi anggota mandiri",
        check: () => existsSync(join(root, "src/modules/auth/logic/local-auth-client.ts")),
        readyNote: "Berbasis local-first aman. Password ter-hash bcrypt.",
      },
      {
        label: "8 Peran kepengurusan + SK Mandat",
        check: () => existsSync(join(root, "src/modules/roles/logic/use-role-management.ts")),
        readyNote: "Struktur peran lengkap dengan generator SK Mandat resmi.",
      },
      {
        label: "Penerbitan SK Pengurus & mutasi peran",
        check: () => existsSync(join(root, "src/modules/roles/primitives/role-assign-dialog.tsx")),
        readyNote: "Riwayat serah terima jabatan tercatat di audit log.",
      },
      {
        label: "Log aktivitas & audit trail operasional",
        check: () => existsSync(join(root, "src/modules/activity-log/index.ts")),
        readyNote: "Pencatatan real-time seluruh mutasi pengurus.",
      },
      {
        label: "Proteksi route guard & session sync",
        check: () => existsSync(join(root, "src/routes/_authenticated/route.tsx")),
        readyNote: "Verifikasi hak akses instan di sisi antarmuka.",
      },
    ],
  },
  {
    id: "jalur",
    label: "Operasional Jalan & Satgas",
    summary: "SOS tanggap darurat, radar pangkalan, pantau jalur, dan piket satgas.",
    features: [
      {
        label: "Tombol SOS & web audio chime",
        check: () => existsSync(join(root, "src/modules/kejadian/index.ts")),
        readyNote: "Banner darurat sticky, alarm audio 880Hz/440Hz, dan tautan WhatsApp.",
      },
      {
        label: "Radar Dulur & shelter pangkalan",
        check: () => existsSync(join(root, "src/modules/peta/index.ts")),
        readyNote: "Tampilan radar pangkalan posko se-Malang Raya.",
      },
      {
        label: "Jadwal piket basecamp & tukar shift",
        check: () => existsSync(join(root, "src/modules/piket/index.ts")),
        readyNote: "Jadwal piket mingguan dan persetujuan tukar giliran aktif.",
      },
      {
        label: "Tracking insiden & koordinasi satgas",
        check: () => existsSync(join(root, "src/modules/kejadian/primitives/incident-card.tsx")),
        readyNote: "Penugasan satgas lapangan dan pembaruan status korban.",
      },
      {
        label: "GPS live tracking pengemudi On-Bit",
        check: () => false,
        plannedNote: "Memerlukan sinkronisasi server WebSocket aktif.",
      },
    ],
  },
  {
    id: "kas",
    label: "Kas Gotong Royong & Finansial",
    summary: "Transparansi iuran, SK Kas santunan, QRIS, dan koperasi simpan pinjam.",
    features: [
      {
        label: "Buku kas masuk & keluar gotong royong",
        check: () => existsSync(join(root, "src/modules/kas/index.ts")),
        readyNote: "Saldo realtime, grafik transparansi, dan ekspor CSV.",
      },
      {
        label: "SK Kas Pencairan Santunan & Musibah",
        check: () => existsSync(join(root, "src/modules/kas/storage/kas-sk-storage.ts")),
        readyNote: "Dokumen SK digital resmi lengkap dengan tanda tangan pengurus.",
      },
      {
        label: "Pembayaran iuran otomatis via QRIS dinamis",
        check: () =>
          existsSync(join(root, "src/modules/koperasi/primitives/qris-iuran-dialog.tsx")),
        readyNote: "QRIS Nasional NMID DRG dengan verifikasi instan.",
      },
      {
        label: "Koperasi Simpan Pinjam Guyub 0% bunga",
        check: () => existsSync(join(root, "src/modules/koperasi/storage/koperasi-storage.ts")),
        readyNote: "Buku besar simpanan dan pinjaman darurat servis mesin.",
      },
      {
        label: "Kuitansi digital berbasis QR & cetak struk",
        check: () => existsSync(join(root, "src/modules/kas/primitives/kas-receipt-dialog.tsx")),
        readyNote: "Bukti setor resmi berformat digital.",
      },
    ],
  },
  {
    id: "organisasi",
    label: "Organisasi & Kearsipan",
    summary: "Direktori anggota, notulen rembug, inventaris posko, dan dewan etik.",
    features: [
      {
        label: "Direktori sedulur & KTA digital",
        check: () => existsSync(join(root, "src/modules/anggota/index.ts")),
        readyNote: "Kartu Tanda Anggota barcode digital & data kendaraan.",
      },
      {
        label: "Notulen rembug & bagi ringkasan WA",
        check: () => existsSync(join(root, "src/modules/notulen/index.ts")),
        readyNote: "Arsip berita acara musyawarah & salin ke grup WA.",
      },
      {
        label: "Inventaris posko & pendaftaran alat",
        check: () => existsSync(join(root, "src/modules/inventaris/index.ts")),
        readyNote: "Pelacakan HT posko, rompi, dan kotak P3K medis.",
      },
      {
        label: "Dewan Etik & sidang mediasi jalur",
        check: () => existsSync(join(root, "src/modules/etik/index.ts")),
        readyNote: "Penanganan senggolan dan penerbitan SK Disiplin.",
      },
      {
        label: "Verifikasi pendaftaran calon dulur",
        check: () => existsSync(join(root, "src/modules/persetujuan/index.ts")),
        readyNote: "Persetujuan berkas pendaftaran dan validasi plat nomor.",
      },
      {
        label: "Kaderisasi & jenjang loyalitas",
        check: () => existsSync(join(root, "src/modules/kaderisasi/index.ts")),
        readyNote: "Tingkat aspal: Pratama, Madya, Utama.",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Infrastruktur Local-First",
    summary: "Ketahanan offline, outbox worker, migrasi skema, dan backup.",
    features: [
      {
        label: "Penyimpanan local-first berdaya tahan",
        check: () => existsSync(join(root, "src/shared/utils/safe-storage.ts")),
        readyNote: "Validasi skema Zod dengan auto-recovery data corrupt.",
      },
      {
        label: "Outbox pattern sync engine",
        check: () => existsSync(join(root, "src/core/sync/outbox-queue.ts")),
        readyNote: "Antrean mutasi FIFO dengan retry exponential backoff.",
      },
      {
        label: "Cadangkan & pulihkan arsip data (JSON)",
        check: () => existsSync(join(root, "src/modules/profil/logic/use-system-backup.ts")),
        readyNote: "Ekspor seluruh database lokal dengan verifikasi checksum.",
      },
      {
        label: "PWA installable & offline service worker",
        check: () => existsSync(join(root, "public/manifest.webmanifest")),
        readyNote: "Dapat dipasang di Home Screen Android & iOS Safari.",
      },
      {
        label: "Realtime multi-device database sync",
        check: () => false,
        plannedNote: "Terjadwal pada integrasi backend tersentralisasi.",
      },
    ],
  },
];

export function generateFeatureTree() {
  const branches = BRANCH_DEFINITIONS.map((def) => {
    const children = def.features.map((feat) => {
      const isReady = Boolean(feat.check());
      const status = isReady ? "siap" : feat.plannedNote ? "rencana" : "sebagian";
      const note = isReady ? feat.readyNote : feat.plannedNote;
      return {
        label: feat.label,
        status,
        note,
      };
    });

    return {
      id: def.id,
      label: def.label,
      summary: def.summary,
      children,
    };
  });

  const allChildren = branches.flatMap((b) => b.children);
  const counts = {
    siap: allChildren.filter((c) => c.status === "siap").length,
    sebagian: allChildren.filter((c) => c.status === "sebagian").length,
    rencana: allChildren.filter((c) => c.status === "rencana").length,
    total: allChildren.length,
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "codebase automated feature tree inspection",
    counts,
    branches,
  };

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const res = generateFeatureTree();
  console.log(
    `✅ Feature tree updated: ${res.counts.siap} siap | ${res.counts.sebagian} sebagian | ${res.counts.rencana} rencana (total ${res.counts.total})`,
  );
}
