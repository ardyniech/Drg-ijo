import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, GraduationCap } from "lucide-react";

interface KaderisasiFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  levelFilter: string;
  onLevelFilterChange: (val: string) => void;
}

export function KaderisasiFilters({
  search,
  onSearchChange,
  levelFilter,
  onLevelFilterChange,
}: KaderisasiFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau ID anggota..."
          className="h-10 pl-9 rounded-xl text-xs bg-background"
        />
      </div>

      <div className="w-full sm:w-48">
        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
          <SelectTrigger className="h-10 rounded-xl text-xs bg-background">
            <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Semua Jenjang" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value="all">Semua Jenjang</SelectItem>
            <SelectItem value="Calon">Calon Anggota</SelectItem>
            <SelectItem value="Muda">Anggota Muda</SelectItem>
            <SelectItem value="Madya">Anggota Madya</SelectItem>
            <SelectItem value="Utama">Anggota Utama</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
