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
    `*BUKTI RESMI TRANSAKSI KAS DRG*\n` +
    `No. Registrasi: ${noKwitansi}\n` +
    `Tanggal: ${tanggalFormat}\n` +
    `Kategori: ${tx.kategori || "Iuran Wajib"}\n` +
    `Jenis: ${tx.jenis === "masuk" ? "Penerimaan / Masuk" : "Pengeluaran"}\n` +
    `Jumlah: ${rupiah(Number(tx.jumlah))}\n` +
    `Status: ${tx.status.toUpperCase()}\n` +
    `Ledger: Kas ${tx.ledger.toUpperCase()}\n` +
    `Keterangan: ${tx.deskripsi || "—"}\n\n` +
    `_Tercatat resmi dalam Sistem Pembukuan DRG App_`
  );
}
