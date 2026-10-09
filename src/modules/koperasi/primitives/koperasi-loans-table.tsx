import { LoanRecord } from "../types";
import { rupiah } from "@/modules/kas";
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
import { CheckCircle2, Coins } from "lucide-react";

interface KoperasiLoansTableProps {
  loans: LoanRecord[];
  canManage: boolean;
  onApprove: (id: string) => void;
  onPayInstallment: (id: string, nominal: number) => void;
}

export function KoperasiLoansTable({
  loans,
  canManage,
  onApprove,
  onPayInstallment,
}: KoperasiLoansTableProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>No. Pengajuan & Peminjam</TableHead>
            <TableHead>Keperluan Pinjaman</TableHead>
            <TableHead>Plafon & Cicilan</TableHead>
            <TableHead>Progres Bayar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => {
            const pct = Math.min(100, Math.round((loan.terbayar / loan.nominal) * 100));
            return (
              <TableRow key={loan.id}>
                <TableCell>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    {loan.no_pengajuan}
                  </p>
                  <p className="text-xs font-medium text-foreground">{loan.nama_peminjam}</p>
                  <p className="text-[10px] text-muted-foreground">{loan.pangkalan}</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-foreground font-medium">{loan.keperluan}</p>
                  <p className="text-[10px] text-muted-foreground">Tgl: {loan.tanggal_pengajuan}</p>
                </TableCell>
                <TableCell>
                  <p className="font-mono text-xs font-bold text-foreground">
                    {rupiah(loan.nominal)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {rupiah(loan.cicilan_per_minggu)}/mgg ({loan.tenor_minggu} mgg)
                  </p>
                </TableCell>
                <TableCell>
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{pct}%</span>
                      <span>{rupiah(loan.terbayar)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      loan.status === "lunas"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                        : loan.status === "disetujui"
                          ? "bg-blue-500/10 text-blue-700 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                    }`}
                  >
                    {loan.status === "lunas"
                      ? "Lunas"
                      : loan.status === "disetujui"
                        ? "Berjalan"
                        : "Diajukan"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {loan.status === "diajukan" && canManage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApprove(loan.id)}
                        className="h-7 text-xs text-emerald-600 hover:text-emerald-700 gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Setujui
                      </Button>
                    )}
                    {loan.status === "disetujui" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPayInstallment(loan.id, loan.cicilan_per_minggu)}
                        className="h-7 text-xs gap-1 text-primary"
                      >
                        <Coins className="h-3 w-3" /> Setor Cicilan
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
