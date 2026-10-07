import { createFileRoute } from "@tanstack/react-router";
import { useMyRoles } from "@/hooks/use-my-role";
import { PageShell } from "@/components/page-shell";
import { PermissionOnboarding } from "@/components/permission-onboarding";
import { Loader2 } from "lucide-react";
import {
  useProfil,
  ProfileSummaryCard,
  ProfileBiodataCard,
  ProfileNotificationsCard,
  ProfilePasswordCard,
  ProfilePushCard,
  BackupRestoreCard,
  SchemaMigrationCard,
} from "@/modules/profil";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Profil & Preferensi — DRG App" },
      {
        name: "description",
        content:
          "Kelola biodata anggota DRG, foto profil, izin GPS on-bit, dan preferensi notifikasi push.",
      },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { roles = [] } = useMyRoles();
  const {
    userId,
    authEmail,
    profile,
    isLoading,
    form,
    setForm,
    saveBio,
    saveNotif,
    handleAvatarUpload,
    canEditJenjang,
  } = useProfil();

  return (
    <PageShell
      eyebrow="Akun Saya"
      title="Profil Pengguna"
      description="Kelola biodata, foto profil, kata sandi, dan preferensi notifikasi kamu."
    >
      {isLoading || !profile ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <PermissionOnboarding userId={userId ?? undefined} />
          </div>

          <ProfileSummaryCard
            profile={profile}
            form={form}
            authEmail={authEmail}
            roles={roles}
            onUploadAvatar={handleAvatarUpload}
          />

          <ProfileBiodataCard
            form={form}
            authEmail={authEmail}
            onFormChange={setForm}
            onSave={() => saveBio.mutate()}
            isSaving={saveBio.isPending}
            canEditJenjang={canEditJenjang}
          />

          <ProfileNotificationsCard
            form={form}
            onToggle={(key, val) => {
              setForm({ ...form, [key]: val });
              saveNotif.mutate({ [key]: val });
            }}
          />

          <ProfilePushCard />

          <ProfilePasswordCard />

          <div className="lg:col-span-3 space-y-6">
            <SchemaMigrationCard />
            <BackupRestoreCard />
          </div>
        </div>
      )}
    </PageShell>
  );
}
