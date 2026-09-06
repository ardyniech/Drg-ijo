export type ScreeningStatus =
  | "menunggu"
  | "wawancara"
  | "direkomendasikan"
  | "ditolak";

export type ScreeningApplication = {
  id: string;
  nama: string;
  no_hp: string;
  email: string | null;
  alamat: string | null;
  kota: string | null;
  motivasi: string | null;
  status: ScreeningStatus;
  skor_total: number | null;
  catatan_pic: string | null;
  created_at: string;
  email_verified?: boolean | null;
};

export type ScreeningAnswerItem = {
  jawaban: string;
  bobot_didapat: number;
  question_id: string;
  screening_questions?: {
    pertanyaan: string;
    bobot_max: number;
  } | null;
};

export type ScreeningAuditItem = {
  id: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
  actor_id: string | null;
  profiles?: {
    nama: string | null;
  } | null;
};

export const statusStyle: Record<ScreeningStatus, string> = {
  menunggu: "border-warn/50 text-warn-foreground",
  wawancara: "border-primary/40 text-primary",
  direkomendasikan: "border-success/40 text-success",
  ditolak: "border-destructive/40 text-destructive",
};

export function buildScreeningCsv(rows: ScreeningApplication[]): string {
  const headers = [
    "Nama",
    "No HP",
    "Email",
    "Kota",
    "Status",
    "Email Verified",
    "Skor",
    "Tgl Submit",
    "Catatan PIC",
  ];
  const body = rows.map((c) => [
    c.nama,
    c.no_hp,
    c.email ?? "",
    c.kota ?? "",
    c.status,
    c.email_verified ? "yes" : "no",
    String(c.skor_total ?? 0),
    new Date(c.created_at).toISOString(),
    (c.catatan_pic ?? "").replace(/\n/g, " "),
  ]);
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...body].map((r) => r.map(esc).join(",")).join("\n");
}
