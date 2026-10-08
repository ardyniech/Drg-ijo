import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberSortOption, MemberViewMode } from "../types";
import { OJOL_JENJANG_FILTER_OPTIONS } from "@/lib/ojol-jenjang";

const STATUS_OPTS = [
  { val: "all", label: "Semua Dulur" },
  { val: "aktif", label: "Sah Satu Aspal" },
  { val: "pending_review", label: "Menunggu PIC" },
  { val: "nonaktif", label: "Rehat Jalur" },
];
const JENJANG_OPTS = OJOL_JENJANG_FILTER_OPTIONS;
const ROLE_OPTS = [
  { val: "all", label: "Semua Amanah" },
  { val: "driver", label: "Rider Jalur" },
  { val: "satgas", label: "Satgas Lapangan" },
  { val: "korlap", label: "Korlap Wilayah" },
  { val: "sekretaris", label: "Juru Tulis Rembug" },
  { val: "bendahara", label: "Bendahara Kas" },
  { val: "ketua", label: "Ketua Paguyuban" },
  { val: "admin", label: "Pengurus Basecamp" },
];
const SORT_OPTS: Array<{ val: MemberSortOption; label: string }> = [
  { val: "terbaru", label: "Terbaru" },
  { val: "nama_asc", label: "Nama (A-Z)" },
  { val: "nama_desc", label: "Nama (Z-A)" },
  { val: "kta", label: "No KTA" },
];

interface MemberFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  selectedPangkalan: string;
  setSelectedPangkalan: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  selectedJenjang?: string;
  setSelectedJenjang?: (v: string) => void;
  viewMode?: MemberViewMode;
  setViewMode?: (v: MemberViewMode) => void;
  sortBy: MemberSortOption;
  setSortBy: (v: MemberSortOption) => void;
  pangkalanOptions: string[];
}

export function MemberFilters({
  search,
  setSearch,
  selectedStatus,
  setSelectedStatus,
  selectedPangkalan,
  setSelectedPangkalan,
  selectedRole,
  setSelectedRole,
  selectedJenjang = "all",
  setSelectedJenjang,
  viewMode = "grid",
  setViewMode,
  sortBy,
  setSortBy,
  pangkalanOptions,
}: MemberFiltersProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama sedulur, no KTA, plat motor, atau pangkalan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[125px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTS.map((o) => (
                <SelectItem key={o.val} value={o.val}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPangkalan} onValueChange={setSelectedPangkalan}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Pangkalan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pangkalan</SelectItem>
              {pangkalanOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.replace("Pangkalan ", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {setSelectedJenjang && (
            <Select value={selectedJenjang} onValueChange={setSelectedJenjang}>
              <SelectTrigger className="w-[120px] h-9 text-xs">
                <SelectValue placeholder="Jenjang" />
              </SelectTrigger>
              <SelectContent>
                {JENJANG_OPTS.map((o) => (
                  <SelectItem key={o.val} value={o.val}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[115px] h-9 text-xs">
              <SelectValue placeholder="Peran" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTS.map((o) => (
                <SelectItem key={o.val} value={o.val}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as MemberSortOption)}>
            <SelectTrigger className="w-[115px] h-9 text-xs">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTS.map((o) => (
                <SelectItem key={o.val} value={o.val}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {setViewMode && (
            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/30">
              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
                title="Tampilan Kartu"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
                title="Tampilan Tabel"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
