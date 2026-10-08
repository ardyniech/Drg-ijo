export interface MonthlyTrendPoint {
  month: string;
  sosial: number;
  koperasi: number;
  pemasukan: number;
  pengeluaran: number;
}

export interface CategoryBreakdownPoint {
  name: string;
  value: number;
  color: string;
}

/**
 * Data historis awal dinonaktifkan untuk lingkungan produksi (Production Clean).
 * Seluruh grafik dan analitik kas kini bersumber 100% dari transaksi riil yang disetujui.
 */
export const HISTORICAL_SEED: MonthlyTrendPoint[] = [];
