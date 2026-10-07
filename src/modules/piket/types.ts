export type Shift = {
  id: string;
  tanggal: string;
  slot: "pagi" | "siang" | "malam";
  wilayah: string | null;
  user_id: string | null;
  catatan: string | null;
};

export type Swap = {
  id: string;
  shift_id: string;
  requested_by: string;
  target_user_id: string | null;
  status: string;
  alasan: string | null;
  created_at: string;
};

export const slots: Shift["slot"][] = ["pagi", "siang", "malam"];

export function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function toIso(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
