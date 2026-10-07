export type ItemStatus = "tersedia" | "dipinjam" | "perbaikan" | "rusak";

export interface InventarisItem {
  id: string;
  kode_alat: string;
  nama_barang: string;
  kategori: "Komunikasi" | "Keselamatan" | "P3K" | "Perlengkapan Pos";
  kondisi: "Sangat Baik" | "Baik" | "Perlu Servis";
  status: ItemStatus;
  lokasi_pos: string;
  peminjam_nama?: string | null;
  peminjam_phone?: string | null;
  tgl_pinjam?: string | null;
}
