import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserCheck } from "lucide-react";

interface ApprovalFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export function ApprovalFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: ApprovalFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pemohon atau plat..."
          className="h-10 pl-9 rounded-xl text-xs bg-background"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="h-10 w-40 rounded-xl text-xs bg-background">
            <UserCheck className="mr-1.5 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="registrasi_baru">Registrasi Baru</SelectItem>
            <SelectItem value="mutasi_pangkalan">Mutasi Pangkalan</SelectItem>
            <SelectItem value="perubahan_role">Kenaikan Role</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-10 w-36 rounded-xl text-xs bg-background">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
