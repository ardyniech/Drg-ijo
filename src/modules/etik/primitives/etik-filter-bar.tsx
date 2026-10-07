import { Search, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

export function EtikFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor perkara, nama, atau kategori..."
          className="h-10 pl-9 rounded-xl text-xs bg-background"
        />
      </div>

      <div className="w-full sm:w-48">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-10 rounded-xl text-xs bg-background">
            <Scale className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="investigating">Penyelidikan</SelectItem>
            <SelectItem value="mediation_scheduled">Jadwal Mediasi</SelectItem>
            <SelectItem value="sanctioned">Dikenakan Sanksi</SelectItem>
            <SelectItem value="resolved">Selesai / Damai</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
