import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";
import { InventarisItem } from "../types";

export function logInventarisBorrow(id: string, peminjam: string) {
  enqueueOperation({
    idempotencyKey: `inv-borrow-${id}-${Date.now()}`,
    action: "Peminjaman Alat Posko",
    module: "inventaris",
    payload: { id, peminjam },
  });
  recordActivityLog({
    actorId: "satgas-peminjam",
    actorName: peminjam || "Petugas Satgas",
    actorRole: "satgas",
    action: "Peminjaman Alat Posko",
    module: "persetujuan",
    description: `Mencatat peminjaman alat inventaris posko oleh ${peminjam}.`,
  });
  toast.success("Peminjaman alat satgas berhasil dicatat");
}

export function logInventarisReturn(id: string) {
  enqueueOperation({
    idempotencyKey: `inv-return-${id}-${Date.now()}`,
    action: "Pengembalian Alat Posko",
    module: "inventaris",
    payload: { id },
  });
  recordActivityLog({
    actorId: "satgas-peminjam",
    actorName: "Petugas Satgas",
    actorRole: "satgas",
    action: "Pengembalian Alat Posko",
    module: "persetujuan",
    description: `Pengembalian alat posko #${id} ke inventaris pangkalan.`,
  });
  toast.success("Alat telah dikembalikan ke pos pantau");
}

export function logInventarisNew(item: InventarisItem) {
  enqueueOperation({
    idempotencyKey: `inv-add-${item.id}-${Date.now()}`,
    action: "Pendaftaran Alat Posko Baru",
    module: "inventaris",
    payload: { id: item.id, nama: item.nama_barang },
  });
  recordActivityLog({
    actorId: "satgas-korlap",
    actorName: "Korlap Wilayah",
    actorRole: "korlap",
    action: "Pendaftaran Alat Posko Baru",
    module: "persetujuan",
    description: `Menambahkan perlengkapan posko baru: ${item.nama_barang} (${item.kode_alat}).`,
  });
  toast.success("Perlengkapan posko baru berhasil didaftarkan");
}
