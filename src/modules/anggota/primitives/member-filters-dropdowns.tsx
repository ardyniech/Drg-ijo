import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberSortOption } from "../types";
import { STATUS_OPTS, ROLE_OPTS, JENJANG_OPTS, SORT_OPTS } from "./member-filters-options";

interface DropdownsProps {
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  selectedPangkalan: string;
  setSelectedPangkalan: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  selectedJenjang?: string;
  setSelectedJenjang?: (v: string) => void;
  sortBy: MemberSortOption;
  setSortBy: (v: MemberSortOption) => void;
  pangkalanOptions: string[];
}

export function MemberFiltersDropdowns({
  selectedStatus,
  setSelectedStatus,
  selectedPangkalan,
  setSelectedPangkalan,
  selectedRole,
  setSelectedRole,
  selectedJenjang = "all",
  setSelectedJenjang,
  sortBy,
  setSortBy,
  pangkalanOptions,
}: DropdownsProps) {
  return (
    <>
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
    </>
  );
}
