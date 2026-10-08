import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Bike } from "lucide-react";
import { OJOL_KADERISASI_FILTER_OPTIONS } from "@/lib/ojol-jenjang";

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
          placeholder="Cari nama, plat nomor, atau KTA..."
          className="h-10 pl-9 rounded-xl text-xs bg-background"
        />
      </div>

      <div className="w-full sm:w-56">
        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
          <SelectTrigger className="h-10 rounded-xl text-xs bg-background">
            <Bike className="mr-2 h-4 w-4 text-primary" />
            <SelectValue placeholder="Semua Tingkat Aspal" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            {OJOL_KADERISASI_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.val} value={opt.val}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
