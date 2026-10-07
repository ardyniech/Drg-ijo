import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemberFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedPangkalan: string;
  setSelectedPangkalan: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
}

export function MemberFilters({
  search,
  setSearch,
  selectedPangkalan,
  setSelectedPangkalan,
  selectedRole,
  setSelectedRole,
}: MemberFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, nomor KTA, atau plat nomor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-xs"
        />
      </div>
      <div className="flex gap-2">
        <Select value={selectedPangkalan} onValueChange={setSelectedPangkalan}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue placeholder="Pangkalan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Pangkalan</SelectItem>
            <SelectItem value="Pangkalan Suhat">Suhat</SelectItem>
            <SelectItem value="Pangkalan Dinoyo">Dinoyo</SelectItem>
            <SelectItem value="Pangkalan Sawojajar">Sawojajar</SelectItem>
            <SelectItem value="Pangkalan Sulfat">Sulfat</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue placeholder="Peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peran</SelectItem>
            <SelectItem value="ketua">Ketua Umum</SelectItem>
            <SelectItem value="sekretaris">Sekretaris</SelectItem>
            <SelectItem value="bendahara">Bendahara</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="korlap">Korlap</SelectItem>
            <SelectItem value="satgas">Satgas</SelectItem>
            <SelectItem value="dewan_etik">Dewan Etik</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
