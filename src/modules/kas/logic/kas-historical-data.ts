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

export const HISTORICAL_SEED: MonthlyTrendPoint[] = [
  { month: "Mei 25", sosial: 4200000, koperasi: 8500000, pemasukan: 3200000, pengeluaran: 1100000 },
  {
    month: "Jun 25",
    sosial: 5100000,
    koperasi: 10200000,
    pemasukan: 3800000,
    pengeluaran: 1400000,
  },
  { month: "Jul 25", sosial: 6300000, koperasi: 12100000, pemasukan: 4100000, pengeluaran: 900000 },
  {
    month: "Agu 25",
    sosial: 7800000,
    koperasi: 14500000,
    pemasukan: 4500000,
    pengeluaran: 1600000,
  },
  {
    month: "Sep 25",
    sosial: 9200000,
    koperasi: 16800000,
    pemasukan: 4900000,
    pengeluaran: 1200000,
  },
  {
    month: "Okt 25",
    sosial: 10800000,
    koperasi: 19400000,
    pemasukan: 5200000,
    pengeluaran: 1800000,
  },
  {
    month: "Nov 25",
    sosial: 12100000,
    koperasi: 22100000,
    pemasukan: 5500000,
    pengeluaran: 1500000,
  },
  {
    month: "Des 25",
    sosial: 13500000,
    koperasi: 24800000,
    pemasukan: 5800000,
    pengeluaran: 2100000,
  },
  {
    month: "Jan 26",
    sosial: 14900000,
    koperasi: 27500000,
    pemasukan: 6100000,
    pengeluaran: 1700000,
  },
  {
    month: "Feb 26",
    sosial: 16200000,
    koperasi: 30200000,
    pemasukan: 6400000,
    pengeluaran: 1900000,
  },
  {
    month: "Mar 26",
    sosial: 17800000,
    koperasi: 33100000,
    pemasukan: 6800000,
    pengeluaran: 1300000,
  },
];
