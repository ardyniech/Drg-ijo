import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileRow } from "../types";
import { OJOL_JENJANG_SELECT_OPTIONS } from "@/lib/ojol-jenjang";

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
        <span>Tingkat Aspal Santui</span>
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
          {OJOL_JENJANG_SELECT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span className="font-medium">{opt.label}</span>{" "}
              <span className="text-[11px] text-muted-foreground">({opt.nickname})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!canEdit && (
        <p className="text-[10px] text-muted-foreground leading-tight">
          Tingkat aspal hanya dapat disahkan oleh Dewan Presidium / Admin Basecamp.
        </p>
      )}
    </div>
  );
}
