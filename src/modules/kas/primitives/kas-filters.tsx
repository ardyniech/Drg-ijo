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
        placeholder="Cari kategori/deskripsi…"
        value={q}
        onChange={(e) => onQChange(e.target.value)}
        className="max-w-xs"
      />
      <Select value={ledgerFilter} onValueChange={onLedgerFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua ledger</SelectItem>
          <SelectItem value="sosial">Sosial</SelectItem>
          <SelectItem value="umum">Koperasi</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua status</SelectItem>
          <SelectItem value="menunggu">Menunggu</SelectItem>
          <SelectItem value="disetujui">Disetujui</SelectItem>
          <SelectItem value="ditolak">Ditolak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
