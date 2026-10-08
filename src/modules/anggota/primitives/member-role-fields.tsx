import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { OJOL_JENJANG_SELECT_OPTIONS } from "@/lib/ojol-jenjang";
import { MemberFormData } from "./member-form-fields";

interface Props {
  form: MemberFormData;
  onChange: (patch: Partial<MemberFormData>) => void;
}

export function MemberRoleFields({ form, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor="m-form-role">Peran / Posisi</Label>
        <Select value={form.role} onValueChange={(v) => onChange({ role: v as LocalUser["role"] })}>
          <SelectTrigger id="m-form-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anggota">Anggota Driver</SelectItem>
            <SelectItem value="satgas">Satgas Lapangan</SelectItem>
            <SelectItem value="korlap">Korlap Pangkalan</SelectItem>
            <SelectItem value="bendahara">Bendahara</SelectItem>
            <SelectItem value="sekretaris">Sekretaris</SelectItem>
            <SelectItem value="dewan_etik">Dewan Etik</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="m-form-jenjang">Tingkat Aspal Santui</Label>
        <Select
          value={form.jenjang}
          onValueChange={(v) => onChange({ jenjang: v as LocalUser["jenjang"] })}
        >
          <SelectTrigger id="m-form-jenjang">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OJOL_JENJANG_SELECT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="font-medium">{opt.label}</span>{" "}
                <span className="text-[11px] text-muted-foreground">({opt.nickname})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
