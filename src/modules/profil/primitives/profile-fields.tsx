import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileRow } from "../types";

interface JenjangProps {
  value: ProfileRow["jenjang"];
  onChange: (val: ProfileRow["jenjang"]) => void;
  canEdit: boolean;
}

export function JenjangSelectField({ value, onChange, canEdit }: JenjangProps) {
  const cn = !canEdit ? "bg-muted/50 text-muted-foreground cursor-not-allowed border-muted/70" : "";
  return (
    <div className="space-y-1.5">
      <Label htmlFor="jenjang" className="flex items-center gap-1.5">
        <span>Jenjang Karir</span>
        {!canEdit && (
          <span className="text-[10px] text-muted-foreground font-normal bg-muted px-1.5 py-0.5 rounded-md border">
            Terkunci
          </span>
        )}
      </Label>
      <Select
        disabled={!canEdit}
        value={value ?? "calon"}
        onValueChange={(v) => onChange(v as ProfileRow["jenjang"])}
      >
        <SelectTrigger id="jenjang" className={cn}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent suppressHydrationWarning>
          {["calon", "muda", "madya", "purna"].map((j) => (
            <SelectItem key={j} value={j}>
              {j.charAt(0).toUpperCase() + j.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!canEdit && (
        <p className="text-[10px] text-muted-foreground leading-tight">
          Hanya dapat diubah oleh Ketua Umum, Admin, atau Dewan Etik.
        </p>
      )}
    </div>
  );
}
