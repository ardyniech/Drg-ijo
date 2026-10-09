import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MemberFilters, MemberHeaderBar, MemberDialogManager, useAnggota } from "@/modules/anggota";
import { MemberContentView } from "@/modules/anggota/primitives/member-content-view";
import { useMemberModals } from "@/modules/anggota/primitives/use-member-modals";

export const Route = createFileRoute("/_authenticated/anggota")({
  head: () => ({
    meta: [
      { title: "Direktori & Manajemen Anggota — DRG App" },
      {
        name: "description",
        content: "Basis data keanggotaan DRG resmi, verifikasi KTA, dan administrasi pengurus.",
      },
    ],
  }),
  component: AnggotaPage,
});

function AnggotaPage() {
  const modals = useMemberModals();
  const anggota = useAnggota();

  return (
    <PageShell
      title="Direktori Sedulur Satu Aspal"
      description={`Keluarga besar driver DRG (${anggota.stats.total} sedulur terdaftar se-Malang Raya), tingkat aspal santui, dan guyub pangkalan.`}
    >
      <div className="space-y-4">
        <MemberHeaderBar
          total={anggota.stats.total}
          verified={anggota.stats.verified}
          pending={anggota.stats.pending}
          pangkalan={anggota.stats.pangkalan}
          canManage={anggota.canManage}
          onAddClick={() => modals.setIsAddOpen(true)}
          onExportCsv={anggota.exportCsv}
          selectedStatus={anggota.selectedStatus}
          onSelectStatus={anggota.setSelectedStatus}
        />

        <MemberFilters
          search={anggota.search}
          setSearch={anggota.setSearch}
          selectedStatus={anggota.selectedStatus}
          setSelectedStatus={anggota.setSelectedStatus}
          selectedPangkalan={anggota.selectedPangkalan}
          setSelectedPangkalan={anggota.setSelectedPangkalan}
          selectedRole={anggota.selectedRole}
          setSelectedRole={anggota.setSelectedRole}
          selectedJenjang={anggota.selectedJenjang}
          setSelectedJenjang={anggota.setSelectedJenjang}
          viewMode={anggota.viewMode}
          setViewMode={anggota.setViewMode}
          sortBy={anggota.sortBy}
          setSortBy={anggota.setSortBy}
          pangkalanOptions={anggota.pangkalanOptions}
        />

        <MemberContentView
          viewMode={anggota.viewMode}
          members={anggota.members}
          isLoading={anggota.isLoading}
          onResetFilters={anggota.resetFilters}
          onSelectMember={(m) => modals.setSelectedMember(m)}
          onVerifyMember={anggota.verifyMember}
          canVerify={anggota.canVerify}
          canManage={anggota.canManage}
          onEditMember={(m) => modals.setEditingMember(m)}
          onDeleteMember={(m) => modals.setDeletingMember(m)}
        />

        <MemberDialogManager
          isAddOpen={modals.isAddOpen}
          setIsAddOpen={modals.setIsAddOpen}
          selectedMember={modals.selectedMember}
          setSelectedMember={modals.setSelectedMember}
          editingMember={modals.editingMember}
          setEditingMember={modals.setEditingMember}
          deletingMember={modals.deletingMember}
          setDeletingMember={modals.setDeletingMember}
          addMember={anggota.addMember}
          updateMember={anggota.updateMember}
          verifyMember={anggota.verifyMember}
          deleteMember={anggota.deleteMember}
          isAdding={anggota.isAdding}
          isUpdating={anggota.isUpdating}
          isDeleting={anggota.isDeleting}
          canManage={anggota.canManage}
          canVerify={anggota.canVerify}
        />
      </div>
    </PageShell>
  );
}
