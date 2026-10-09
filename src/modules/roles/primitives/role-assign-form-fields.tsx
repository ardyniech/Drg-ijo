import { UserRole } from "@/hooks/use-me";
import { AVAILABLE_ROLES } from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  skNumber: string;
  onSkChange: (sk: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function RoleAssignFormFields({
  selectedRole,
  onRoleChange,
  skNumber,
  onSkChange,
  notes,
  onNotesChange,
}: Props) {
  const targetDef = AVAILABLE_ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="space-y-3.5">
      <div>
        <label className="font-medium text-foreground">Peran / Jabatan Baru</label>
        <Select value={selectedRole} onValueChange={(v) => onRoleChange(v as UserRole)}>
          <SelectTrigger className="mt-1 h-9 rounded-xl text-xs">
            <SelectValue placeholder="Pilih Peran" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            {AVAILABLE_ROLES.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name} ({role.category.replace("_", " ")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1 text-[11px] text-muted-foreground">{targetDef?.description}</p>
      </div>

      <div>
        <label className="font-medium text-foreground">Nomor Surat Keputusan (SK) Mandat</label>
        <Input
          required
          value={skNumber}
          onChange={(e) => onSkChange(e.target.value)}
          placeholder="Contoh: SK-KETUA/DRG/05/2026"
          className="mt-1 h-9 rounded-xl text-xs"
        />
      </div>

      <div>
        <label className="font-medium text-foreground">Catatan Rembug / Alasan</label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Contoh: Hasil musyawarah pleno pembagian koordinator wilayah..."
          className="mt-1 h-18 rounded-xl text-xs"
        />
      </div>
    </div>
  );
}
