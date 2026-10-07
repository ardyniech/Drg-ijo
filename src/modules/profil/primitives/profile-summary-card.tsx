import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, User as UserIcon } from "lucide-react";
import { ProfileRow, getInitials } from "../types";

interface Props {
  profile: ProfileRow;
  form: Partial<ProfileRow>;
  authEmail: string | null;
  roles: string[];
  onUploadAvatar: (file: File) => void;
}

export function ProfileSummaryCard({ profile, form, authEmail, roles, onUploadAvatar }: Props) {
  const initials = getInitials(form.nama ?? authEmail);

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserIcon className="h-4 w-4" /> Ringkasan
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {form.foto_url ? (
            <img
              src={form.foto_url}
              alt={form.nama ?? ""}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-primary/30"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/15 font-display text-2xl font-bold text-primary">
              {initials}
            </div>
          )}
        </div>
        <div>
          <div className="font-display text-lg font-semibold">{form.nama || "Anggota DRG"}</div>
          <div className="text-xs text-muted-foreground">{authEmail}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Badge variant="secondary" className="capitalize">
            {profile.jenjang}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {profile.status}
          </Badge>
          {roles.map((r) => (
            <Badge key={r} className="bg-primary/15 text-primary hover:bg-primary/20">
              {r}
            </Badge>
          ))}
        </div>
        <Separator />
        <div className="w-full">
          <Label
            htmlFor="avatar"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Upload className="h-4 w-4" /> Unggah foto
          </Label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUploadAvatar(f);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
