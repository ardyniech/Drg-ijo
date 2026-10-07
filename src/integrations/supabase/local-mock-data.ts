export const MOCK_SCREENING_QUESTIONS = [
  {
    id: "q1",
    urutan: 1,
    pertanyaan: "Berapa lama pengalaman mengemudi Anda?",
    tipe: "pilihan",
    opsi: [{ label: "> 3 tahun" }, { label: "1-3 tahun" }, { label: "< 1 tahun" }],
  },
  {
    id: "q2",
    urutan: 2,
    pertanyaan: "Apakah bersedia ikut piket malam darurat?",
    tipe: "pilihan",
    opsi: [{ label: "Sangat Bersedia" }, { label: "Kondisional" }],
  },
];

export const MOCK_KAS_TRANSACTIONS: Array<Record<string, unknown>> = [];

export const MOCK_PIKET_SHIFTS: Array<Record<string, unknown>> = [];
