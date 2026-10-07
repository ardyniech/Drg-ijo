import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileRow } from "../types";
import { JenjangSelectField } from "./profile-fields";

interface Props {
  form: Partial<ProfileRow>;
  authEmail: string | null;
  onFormChange: (form: Partial<ProfileRow>) => void;
  onSave: () => void;
  isSaving: boolean;
  canEditJenjang?: boolean;
}

export function ProfileBiodataCard({
  form,
  authEmail,
  onFormChange,
  onSave,
  isSaving,
  canEditJenjang = false,
}: Props) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Biodata</CardTitle>
        <CardDescription>Data ini terlihat oleh sesama anggota di direktori.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama lengkap</Label>
            <Input
              id="nama"
              value={form.nama ?? ""}
              onChange={(e) => onFormChange({ ...form, nama: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="no_hp">Nomor HP</Label>
            <Input
              id="no_hp"
              inputMode="tel"
              value={form.no_hp ?? ""}
              onChange={(e) => onFormChange({ ...form, no_hp: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email_kontak">Email kontak</Label>
            <Input
              id="email_kontak"
              type="email"
              placeholder={authEmail ?? ""}
              value={form.email ?? ""}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
            />
          </div>
          <JenjangSelectField
            value={form.jenjang ?? "calon"}
            onChange={(v) => onFormChange({ ...form, jenjang: v })}
            canEdit={canEditJenjang}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            value={form.alamat ?? ""}
            onChange={(e) => onFormChange({ ...form, alamat: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio singkat</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Ceritakan sedikit tentang kamu…"
            value={form.bio ?? ""}
            onChange={(e) => onFormChange({ ...form, bio: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan biodata
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
