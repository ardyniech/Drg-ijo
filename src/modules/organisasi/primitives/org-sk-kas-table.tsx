import { KasSkRecord, rupiah } from "@/modules/kas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export function OrgSkKasTable({
  skKas,
  onCairkanSk,
}: {
  skKas: KasSkRecord[];
  onCairkanSk: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nomor SK & Tanggal</TableHead>
            <TableHead>Peruntukan Santunan</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skKas.map((sk) => (
            <TableRow key={sk.id}>
              <TableCell>
                <p className="font-mono text-xs font-semibold text-foreground">{sk.no_sk}</p>
                <p className="text-[10px] text-muted-foreground">{sk.tanggal}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-xs text-foreground">{sk.judul}</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {sk.kategori.replace("_", " ")}
                </p>
              </TableCell>
              <TableCell>
                <p className="font-semibold text-xs text-foreground">{sk.penerima_nama}</p>
                <p className="text-[10px] text-muted-foreground">{sk.penerima_pangkalan}</p>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs font-bold text-emerald-600">
                  {rupiah(sk.nominal)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    sk.status === "dicairkan"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-amber-500/10 text-amber-700"
                  }`}
                >
                  {sk.status === "dicairkan" ? "Dicairkan" : "Disahkan"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {sk.status !== "dicairkan" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCairkanSk(sk.id)}
                    className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Cairkan
                  </Button>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-mono">Tersalurkan</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
