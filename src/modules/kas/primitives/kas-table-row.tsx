import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, TrendingDown, TrendingUp, X, Receipt } from "lucide-react";
import { Tx, rupiah, tierOf } from "../types";

interface Props {
  row: Tx;
  canApprove: boolean;
  canApproveTier: (jumlah: number) => boolean;
  onSelectTx: (tx: Tx) => void;
  onApprove: (id: string, status: "disetujui" | "ditolak") => void;
}

export function KasTableRow({ row: r, canApprove, canApproveTier, onSelectTx, onApprove }: Props) {
  return (
    <tr className="border-t border-border/60 align-top hover:bg-muted/30">
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(r.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="capitalize">
          {r.ledger}
        </Badge>
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
      <td
        className={
          "px-4 py-3 text-right font-mono font-semibold " +
          (r.jenis === "masuk" ? "text-emerald-600" : "text-amber-600")
        }
      >
        <span className="inline-flex items-center gap-1">
          {r.jenis === "masuk" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {r.jenis === "masuk" ? "+" : "-"}
          {rupiah(Number(r.jumlah))}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge
          className={
            r.status === "disetujui"
              ? "bg-emerald-500/20 text-emerald-700 font-medium"
              : r.status === "ditolak"
                ? "bg-muted text-muted-foreground line-through"
                : "bg-amber-500/20 text-amber-700 font-medium"
          }
        >
          {r.status === "disetujui"
            ? "Sah Masuk Kas"
            : r.status === "ditolak"
              ? "Ditolak Rembug"
              : "Nunggu Sahin"}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onSelectTx(r)}
            title="Lihat Kwitansi Satu Aspal"
          >
            <Receipt className="h-3.5 w-3.5" />
          </Button>
          {canApprove &&
            r.status === "menunggu" &&
            (canApproveTier(Number(r.jumlah)) ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => onApprove(r.id, "disetujui")}
                  title="Setujui"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => onApprove(r.id, "ditolak")}
                  title="Tolak"
                >
                  <X className="h-3.5 w-3.5 text-rose-600" />
                </Button>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                Butuh {tierOf(Number(r.jumlah))?.role.replace("_", " ")}
              </span>
            ))}
        </div>
      </td>
    </tr>
  );
}
