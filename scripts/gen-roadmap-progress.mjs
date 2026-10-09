/**
 * Automatically computes roadmap progress from codebase verification.
 * Eliminates hardcoded percentages so the About page always reflects reality.
 * Runs in predev, prebuild, and auto-sync.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src/modules/about/data/roadmap.json");

const PHASES_CONFIG = [
  {
    phase: "Fase 1",
    title: "Fondasi & Antarmuka",
    items: [
      {
        text: "Desain sistem & tema hangat",
        check: () => existsSync(join(root, "src/styles.css")),
      },
      {
        text: "Routing, layout, sidebar",
        check: () => existsSync(join(root, "src/components/layout/sidebar-nav-config.ts")),
      },
      {
        text: "PWA dasar & landing page",
        check: () =>
          existsSync(join(root, "public/manifest.webmanifest")) &&
          existsSync(join(root, "src/modules/landing")),
      },
    ],
  },
  {
    phase: "Fase 2",
    title: "Modul Organisasi & Kas",
    items: [
      {
        text: "Anggota, peran, SK Mandat",
        check: () =>
          existsSync(join(root, "src/modules/anggota")) &&
          existsSync(join(root, "src/modules/roles")),
      },
      {
        text: "Kas gotong royong & SK Kas",
        check: () => existsSync(join(root, "src/modules/kas/storage/kas-sk-storage.ts")),
      },
      {
        text: "Notulen rembug & ekspor WA",
        check: () => existsSync(join(root, "src/modules/notulen")),
      },
      {
        text: "Inventaris posko & tambah alat",
        check: () =>
          existsSync(join(root, "src/modules/inventaris/primitives/new-item-dialog.tsx")),
      },
      {
        text: "Dewan etik & sidang disiplin",
        check: () => existsSync(join(root, "src/modules/etik")),
      },
      {
        text: "Persetujuan akun & KTA digital",
        check: () => existsSync(join(root, "src/modules/persetujuan")),
      },
    ],
  },
  {
    phase: "Fase 3",
    title: "Koperasi & Finansial Santui",
    items: [
      {
        text: "Koperasi simpan pinjam 0% bunga",
        check: () => existsSync(join(root, "src/modules/koperasi/storage/koperasi-storage.ts")),
      },
      {
        text: "Pembayaran iuran via QRIS dinamis",
        check: () =>
          existsSync(join(root, "src/modules/koperasi/primitives/qris-iuran-dialog.tsx")),
      },
      {
        text: "SOS pantau jalur & web audio alert",
        check: () => existsSync(join(root, "src/modules/kejadian")),
      },
      {
        text: "Jadwal piket satgas & tukar shift",
        check: () => existsSync(join(root, "src/modules/piket")),
      },
      {
        text: "Radar dulur & peta pangkalan",
        check: () => existsSync(join(root, "src/modules/peta")),
      },
    ],
  },
  {
    phase: "Fase 4",
    title: "Sinkronisasi Server & Outbox",
    items: [
      {
        text: "Local-first outbox pattern sync",
        check: () => existsSync(join(root, "src/core/sync/outbox-queue.ts")),
      },
      {
        text: "Audit log activity tracking",
        check: () => existsSync(join(root, "src/modules/activity-log")),
      },
      {
        text: "Database migration verifier",
        check: () => existsSync(join(root, "src/core/migrations/migration-runner.ts")),
      },
      {
        text: "Disaster recovery backup & restore",
        check: () => existsSync(join(root, "src/modules/profil/logic/use-system-backup.ts")),
      },
    ],
  },
  {
    phase: "Fase 5",
    title: "Multi-Perangkat & Telemetri AI",
    items: [
      {
        text: "Web Push notification background",
        check: () => existsSync(join(root, "public/sw.js")),
      },
      {
        text: "Koneksi multi-device realtime",
        check: () => existsSync(join(root, "src/core/realtime/realtime-channel.ts")),
      },
      {
        text: "AI Dispatching & Safety Intelligence",
        check: () => existsSync(join(root, "src/routes/api.ai.dispatch.ts")),
      },
    ],
  },
];

export function generateRoadmapProgress() {
  const result = PHASES_CONFIG.map((cfg) => {
    const total = cfg.items.length;
    const completed = cfg.items.filter((it) => {
      try {
        return Boolean(it.check());
      } catch {
        return false;
      }
    }).length;

    const progress = Math.min(100, Math.round((completed / total) * 100));
    const status = progress === 100 ? "selesai" : progress > 0 ? "jalan" : "rencana";

    return {
      phase: cfg.phase,
      title: cfg.title,
      progress,
      status,
      completedItems: completed,
      totalItems: total,
      items: cfg.items.map((it) => it.text),
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "codebase feature inspection",
    phases: result,
  };

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const res = generateRoadmapProgress();
  console.log(
    "✅ Roadmap progress updated:",
    res.map((r) => `${r.phase}: ${r.progress}% (${r.status})`).join(" | "),
  );
}
