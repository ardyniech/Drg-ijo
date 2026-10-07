export type IncidentSeverity = "darurat_tinggi" | "sedang" | "ringan";
export type IncidentCategory =
  | "kecelakaan"
  | "begal_kriminal"
  | "mogok_mesin"
  | "razia_kendala"
  | "medis";
export type IncidentStatus = "aktif" | "dalam_penanganan" | "selesai" | "dibatalkan";

export interface IncidentRecord {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  kategori: IncidentCategory;
  tingkat: IncidentSeverity;
  deskripsi: string;
  lat: number;
  lng: number;
  lokasi_teks: string;
  status: IncidentStatus;
  responders: string[];
  created_at: string;
  updated_at: string;
}
