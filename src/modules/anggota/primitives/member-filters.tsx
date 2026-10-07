import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberSortOption } from "../types";

interface MemberFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  selectedPangkalan: string;
  setSelectedPangkalan: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
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
  sortBy,
  setSortBy,
  pangkalanOptions,
}: MemberFiltersProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari driver, no KTA, plat nomor, atau pangkalan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-36 h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="aktif">Verified</SelectItem>
              <SelectItem value="pending_review">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPangkalan} onValueChange={setSelectedPangkalan}>
            <SelectTrigger className="w-full sm:w-36 h-9 text-xs">
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

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-32 h-9 text-xs">
              <SelectValue placeholder="Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peran</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="satgas">Satgas</SelectItem>
              <SelectItem value="korlap">Korlap</SelectItem>
              <SelectItem value="ketua">Ketua</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as MemberSortOption)}>
            <SelectTrigger className="w-full sm:w-32 h-9 text-xs">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="nama_asc">Nama (A-Z)</SelectItem>
              <SelectItem value="nama_desc">Nama (Z-A)</SelectItem>
              <SelectItem value="kta">No KTA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
