import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberSortOption, MemberViewMode } from "../types";
import { MemberFiltersDropdowns } from "./member-filters-dropdowns";

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
          <MemberFiltersDropdowns
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedPangkalan={selectedPangkalan}
            setSelectedPangkalan={setSelectedPangkalan}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedJenjang={selectedJenjang}
            setSelectedJenjang={setSelectedJenjang}
            sortBy={sortBy}
            setSortBy={setSortBy}
            pangkalanOptions={pangkalanOptions}
          />

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
