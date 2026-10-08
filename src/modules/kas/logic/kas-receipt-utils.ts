import { Tx, rupiah } from "../types";

export function formatNoKwitansi(txId: string): string {
  return `KW-DRG-${txId
    .replace(/[^0-9a-zA-Z]/g, "")
    .slice(0, 8)
    .toUpperCase()}`;
}

export function formatTanggal(tanggal: string): string {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateWaSlipText(tx: Tx): string {
  const noKwitansi = formatNoKwitansi(tx.id);
  const tanggalFormat = formatTanggal(tx.tanggal);
  return (
    `*SLIP KAS GOTONG ROYONG SATU ASPAL DRG*\n` +
    `No. Kwitansi: ${noKwitansi}\n` +
    `Hari/Tanggal: ${tanggalFormat}\n` +
    `Kategori: ${tx.kategori || "Iuran Seduluran"}\n` +
    `Arus Kas: ${tx.jenis === "masuk" ? "Urunan Masuk (+)" : "Penyaluran Santunan (-)"}\n` +
    `Nominal: ${rupiah(Number(tx.jumlah))}\n` +
    `Status: ${tx.status === "disetujui" ? "SAH DIVERIFIKASI BENDAHARA" : "MENUNGGU REMBUG"}\n` +
    `Pos Kas: Kas ${tx.ledger.toUpperCase()}\n` +
    `Catatan: ${tx.deskripsi || "—"}\n\n` +
    `_Keluarga Besar Driver Riang Gembira (DRG) • Salam Satu Aspal Santui_`
  );
}
