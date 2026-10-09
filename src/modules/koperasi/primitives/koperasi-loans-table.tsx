import { LoanRecord } from "../types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KoperasiLoanRow } from "./koperasi-loan-row";

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
          {loans.map((loan) => (
            <KoperasiLoanRow
              key={loan.id}
              loan={loan}
              canManage={canManage}
              onApprove={onApprove}
              onPayInstallment={onPayInstallment}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
