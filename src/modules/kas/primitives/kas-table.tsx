import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tx } from "../types";
import { KasReceiptModal } from "./kas-receipt-modal";
import { KasTableRow } from "./kas-table-row";

interface Props {
  rows: Tx[];
  isLoading: boolean;
  canApprove: boolean;
  canApproveTier: (jumlah: number) => boolean;
  onApprove: (id: string, status: "disetujui" | "ditolak") => void;
}

export function KasTable({ rows, isLoading, canApprove, canApproveTier, onApprove }: Props) {
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        Belum ada catatan transaksi yang cocok. Yuk gas gotong royong bareng sedulur!
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Hari / Tanggal</th>
              <th className="px-4 py-2 text-left">Buku Kas</th>
              <th className="px-4 py-2 text-left">Kategori & Uraian</th>
              <th className="px-4 py-2 text-right">Nominal Urunan</th>
              <th className="px-4 py-2 text-left">Status Verif</th>
              <th className="px-4 py-2 text-right">Kwitansi & Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <KasTableRow
                key={r.id}
                row={r}
                canApprove={canApprove}
                canApproveTier={canApproveTier}
                onSelectTx={setSelectedTx}
                onApprove={onApprove}
              />
            ))}
          </tbody>
        </table>
      </div>
      <KasReceiptModal
        tx={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </>
  );
}
