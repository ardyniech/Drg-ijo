import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ScreeningStatus } from "../types";

interface Props {
  q: string;
  onQueryChange: (q: string) => void;
  statusFilter: ScreeningStatus | "all";
  onStatusFilterChange: (s: ScreeningStatus | "all") => void;
  verifFilter: "all" | "verified" | "unverified";
  onVerifFilterChange: (v: "all" | "verified" | "unverified") => void;
  filteredCount: number;
  totalCount: number;
}

export function ScreeningFilters({
  q,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  verifFilter,
  onVerifFilterChange,
  filteredCount,
  totalCount,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama, HP, email, kota…"
          value={q}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusFilterChange(v as ScreeningStatus | "all")}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua status</SelectItem>
          <SelectItem value="menunggu">Menunggu</SelectItem>
          <SelectItem value="wawancara">Wawancara</SelectItem>
          <SelectItem value="direkomendasikan">Direkomendasikan</SelectItem>
          <SelectItem value="ditolak">Ditolak</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={verifFilter}
        onValueChange={(v) => onVerifFilterChange(v as "all" | "verified" | "unverified")}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua verifikasi</SelectItem>
          <SelectItem value="verified">Email terverifikasi</SelectItem>
          <SelectItem value="unverified">Belum verifikasi</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">
        {filteredCount} / {totalCount}
      </span>
    </div>
  );
}
