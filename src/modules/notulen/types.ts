export interface NotulenRecord {
  id: string;
  judul: string;
  tanggal: string;
  lokasi: string;
  pemimpin_rapat: string;
  notulis: string;
  peserta_count: number;
  agenda: string;
  poin_keputusan: string[];
  status: "disahkan" | "draft";
  created_at: string;
}
