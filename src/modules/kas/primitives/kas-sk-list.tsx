import { useState } from "react";
import { KasSkRecord, rupiah } from "../types";
import { useKasSk } from "../logic/use-kas-sk";
import { KasSkDialog } from "./kas-sk-dialog";
import { NewKasSkDialog } from "./new-kas-sk-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, HeartHandshake } from "lucide-react";

export function KasSkList() {
  const { records, isLoading, cairkanSk } = useKasSk();
  const [selectedRecord, setSelectedRecord] = useState<KasSkRecord | null>(null);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat arsip SK Kas Gotong Royong...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <HeartHandshake className="h-4 w-4 text-primary" /> Arsip SK Santunan & Kas Gotong
            Royong
          </h3>
          <p className="text-xs text-muted-foreground">
            Surat Keputusan Resmi pencairan dana solidaritas dan santunan musibah anggota DRG.
          </p>
        </div>
        <NewKasSkDialog />
      </div>

      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nomor SK & Tanggal</TableHead>
              <TableHead>Peruntukan Santunan</TableHead>
              <TableHead>Penerima & Pangkalan</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-mono text-xs font-semibold text-foreground">{r.no_sk}</p>
                  <p className="text-[11px] text-muted-foreground">{r.tanggal}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-xs text-foreground">{r.judul}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {r.kategori.replace("_", " ")}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-xs text-foreground">{r.penerima_nama}</p>
                  <p className="text-[11px] text-muted-foreground">{r.penerima_pangkalan}</p>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {rupiah(r.nominal)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      r.status === "dicairkan"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                    }`}
                  >
                    {r.status === "dicairkan" ? "Dicairkan" : "Disahkan"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status !== "dicairkan" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cairkanSk.mutate(r.id)}
                        disabled={cairkanSk.isPending}
                        className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Cairkan
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRecord(r)}
                      className="h-7 text-xs gap-1"
                    >
                      <FileText className="h-3 w-3" /> Lihat SK
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <KasSkDialog
        record={selectedRecord}
        open={!!selectedRecord}
        onOpenChange={(op) => !op && setSelectedRecord(null)}
      />
    </div>
  );
}
