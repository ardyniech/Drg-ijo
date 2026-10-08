import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tx } from "../types";

interface Props {
  q: string;
  onQChange: (val: string) => void;
  ledgerFilter: "all" | "sosial" | "umum";
  onLedgerFilterChange: (val: "all" | "sosial" | "umum") => void;
  statusFilter: "all" | Tx["status"];
  onStatusFilterChange: (val: "all" | Tx["status"]) => void;
}

export function KasFilters({
  q,
  onQChange,
  ledgerFilter,
  onLedgerFilterChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Input
        placeholder="Cari transaksi, santunan, urunan..."
        value={q}
        onChange={(e) => onQChange(e.target.value)}
        className="max-w-xs"
      />
      <Select value={ledgerFilter} onValueChange={onLedgerFilterChange}>
        <SelectTrigger className="w-[165px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Buku Kas</SelectItem>
          <SelectItem value="sosial">Kas Sosial Santunan</SelectItem>
          <SelectItem value="umum">Kas Koperasi Guyub</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[175px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="menunggu">Menunggu Verif</SelectItem>
          <SelectItem value="disetujui">Sah Masuk Kas</SelectItem>
          <SelectItem value="ditolak">Ditolak Rembug</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
