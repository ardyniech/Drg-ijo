export interface RoadmapPhase {
  phase: string;
  title: string;
  progress: number;
  status: "selesai" | "jalan" | "rencana";
  items: string[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: "Fase 1",
    title: "Fondasi & Antarmuka",
    progress: 100,
    status: "selesai",
    items: ["Desain sistem & tema hangat", "Routing, layout, sidebar", "PWA dasar & landing page"],
  },
  {
    phase: "Fase 2",
    title: "Modul Organisasi & Kas",
    progress: 85,
    status: "jalan",
    items: ["Anggota, peran, SK", "Kas gotong royong", "Notulen, inventaris, etik"],
  },
  {
    phase: "Fase 3",
    title: "Satgas, SOS & Piket",
    progress: 60,
    status: "jalan",
    items: ["SOS & penanganan kejadian", "Jadwal piket", "Tukar shift (belum tersimpan)"],
  },
  {
    phase: "Fase 4",
    title: "Sinkronisasi Server & Peta Live",
    progress: 15,
    status: "rencana",
    items: ["Database pusat", "GPS On-Bit", "Dispatch personel terdekat"],
  },
  {
    phase: "Fase 5",
    title: "Multi-Perangkat & Notifikasi",
    progress: 5,
    status: "rencana",
    items: ["Realtime antar pengguna", "Push SOS sungguhan", "Kontrol akses server-side"],
  },
];
