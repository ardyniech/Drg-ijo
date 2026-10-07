import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMyRoles } from "@/hooks/use-my-role";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Loader2, Settings, ArrowRight } from "lucide-react";
import {
  useProfil,
  ProfileHeaderHero,
  ProfilePersonalCard,
  ProfileVehicleCard,
  ProfileEmergencyCard,
  ProfileEditDialog,
} from "@/modules/profil";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Profil Anggota — DRG App" },
      {
        name: "description",
        content: "Data biodata anggota lengkap, kendaraan operasional, dan kontak darurat DRG.",
      },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { roles = [] } = useMyRoles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { profile, isLoading, form, setForm, saveBio, handleAvatarUpload } = useProfil();

  return (
    <PageShell
      eyebrow="Identitas Driver"
      title="Profil Anggota"
      description="Kelola biodata diri, armada kendaraan operasional, dan nomor kontak darurat kamu."
    >
      {isLoading || !profile ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <ProfileHeaderHero
            profile={profile}
            roles={roles}
            onUploadAvatar={handleAvatarUpload}
            onOpenEdit={() => setIsEditDialogOpen(true)}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ProfilePersonalCard profile={profile} />
            <div className="space-y-6">
              <ProfileVehicleCard profile={profile} />
              <ProfileEmergencyCard profile={profile} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Pengaturan & Preferensi Sistem</p>
                <p className="text-xs text-muted-foreground">
                  Kelola notifikasi push, kata sandi akun, izin GPS, dan cadangan data.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
              <Link to="/pengaturan">
                Buka Pengaturan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ProfileEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            form={form}
            onChange={setForm}
            onSave={async () => {
              await saveBio.mutateAsync();
              setIsEditDialogOpen(false);
            }}
            isSaving={saveBio.isPending}
          />
        </div>
      )}
    </PageShell>
  );
}
