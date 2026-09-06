import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2, TrendingDown, TrendingUp, X } from "lucide-react";
import { Tx, rupiah, tierOf } from "../types";

interface Props {
  rows: Tx[];
  isLoading: boolean;
  canApprove: boolean;
  canApproveTier: (jumlah: number) => boolean;
  onApprove: (id: string, status: "disetujui" | "ditolak") => void;
}

export function KasTable({ rows, isLoading, canApprove, canApproveTier, onApprove }: Props) {
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
        Tidak ada transaksi sesuai filter.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Ledger</th>
            <th className="px-4 py-2 text-left">Kategori</th>
            <th className="px-4 py-2 text-right">Jumlah</th>
            <th className="px-4 py-2 text-left">Status</th>
            {canApprove && <th className="px-4 py-2 text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border/60 align-top hover:bg-muted/30">
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(r.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="capitalize">{r.ledger}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold">{r.kategori ?? "—"}</div>
                {r.deskripsi && <div className="text-xs text-muted-foreground">{r.deskripsi}</div>}
                {tierOf(Number(r.jumlah)) && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {tierOf(Number(r.jumlah))!.label}
                  </Badge>
                )}
              </td>
              <td className={"px-4 py-3 text-right font-mono font-semibold " + (r.jenis === "masuk" ? "text-success" : "text-signal")}>
                <span className="inline-flex items-center gap-1">
                  {r.jenis === "masuk" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {r.jenis === "masuk" ? "+" : "-"}{rupiah(Number(r.jumlah))}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={
                    r.status === "disetujui"
                      ? "bg-success/20 text-success"
                      : r.status === "ditolak"
                        ? "bg-muted text-muted-foreground line-through"
                        : "bg-warn text-warn-foreground"
                  }
                >
                  {r.status}
                </Badge>
              </td>
              {canApprove && (
                <td className="px-4 py-3 text-right">
                  {r.status === "menunggu" ? (
                    canApproveTier(Number(r.jumlah)) ? (
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onApprove(r.id, "disetujui")}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onApprove(r.id, "ditolak")}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        Butuh {tierOf(Number(r.jumlah))?.role.replace("_", " ")}
                      </span>
                    )
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      {r.approved_at ? new Date(r.approved_at).toLocaleDateString("id-ID") : "—"}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
