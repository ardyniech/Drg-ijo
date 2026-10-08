import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { PermissionOnboarding } from "@/components/permission-onboarding";
import { Loader2 } from "lucide-react";
import {
  useProfil,
  ProfileNotificationsCard,
  ProfilePasswordCard,
  ProfilePushCard,
  BackupRestoreCard,
  SchemaMigrationCard,
} from "@/modules/profil";

export const Route = createFileRoute("/_authenticated/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan & Preferensi — DRG App" },
      {
        name: "description",
        content: "Kelola notifikasi, kata sandi, izin perangkat GPS, dan pemulihan data.",
      },
    ],
  }),
  component: PengaturanPage,
});

function PengaturanPage() {
  const { userId, form, setForm, saveNotif, isLoading } = useProfil();

  return (
    <PageShell
      eyebrow="Kenyamanan & Keamanan"
      title="Setelan Aplikasi & Akun"
      description="Atur notifikasi pangkalan, kata sandi, izin GPS pantau lokasi live, dan backup data seduluran."
    >
      {isLoading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <PermissionOnboarding userId={userId ?? undefined} />

          <div className="grid gap-6 md:grid-cols-2">
            <ProfileNotificationsCard
              form={form}
              onToggle={(key, val) => {
                setForm({ ...form, [key]: val });
                saveNotif.mutate({ [key]: val });
              }}
            />

            <ProfilePushCard />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProfilePasswordCard />
            <SchemaMigrationCard />
          </div>

          <BackupRestoreCard />
        </div>
      )}
    </PageShell>
  );
}
