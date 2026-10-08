import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  MemberFilters,
  MemberDirectoryGrid,
  MemberTableView,
  MemberHeaderBar,
  MemberDialogManager,
  useAnggota,
  MemberRecord,
} from "@/modules/anggota";

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberRecord | null>(null);

  const {
    members,
    stats,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedPangkalan,
    setSelectedPangkalan,
    selectedRole,
    setSelectedRole,
    selectedJenjang,
    setSelectedJenjang,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    pangkalanOptions,
    resetFilters,
    exportCsv,
    isLoading,
    canManage,
    canVerify,
    addMember,
    updateMember,
    verifyMember,
    deleteMember,
    isAdding,
    isUpdating,
    isDeleting,
  } = useAnggota();

  return (
    <PageShell
      title="Direktori Sedulur Satu Aspal"
      description={`Keluarga besar driver DRG (${stats.total} sedulur terdaftar se-Malang Raya), tingkat aspal santui, dan guyub pangkalan.`}
    >
      <div className="space-y-4">
        <MemberHeaderBar
          total={stats.total}
          verified={stats.verified}
          pending={stats.pending}
          pangkalan={stats.pangkalan}
          canManage={canManage}
          onAddClick={() => setIsAddOpen(true)}
          onExportCsv={exportCsv}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        <MemberFilters
          search={search}
          setSearch={setSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPangkalan={selectedPangkalan}
          setSelectedPangkalan={setSelectedPangkalan}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedJenjang={selectedJenjang}
          setSelectedJenjang={setSelectedJenjang}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          pangkalanOptions={pangkalanOptions}
        />

        {viewMode === "grid" ? (
          <MemberDirectoryGrid
            members={members}
            isLoading={isLoading}
            onResetFilters={resetFilters}
            onSelectMember={(m) => setSelectedMember(m)}
            onVerifyMember={verifyMember}
            canVerify={canVerify}
            canManage={canManage}
            onEditMember={(m) => setEditingMember(m)}
            onDeleteMember={(m) => setDeletingMember(m)}
          />
        ) : (
          <MemberTableView
            members={members}
            isLoading={isLoading}
            onResetFilters={resetFilters}
            onSelectMember={(m) => setSelectedMember(m)}
            onVerifyMember={verifyMember}
            canVerify={canVerify}
            canManage={canManage}
            onEditMember={(m) => setEditingMember(m)}
            onDeleteMember={(m) => setDeletingMember(m)}
          />
        )}

        <MemberDialogManager
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          editingMember={editingMember}
          setEditingMember={setEditingMember}
          deletingMember={deletingMember}
          setDeletingMember={setDeletingMember}
          addMember={addMember}
          updateMember={updateMember}
          verifyMember={verifyMember}
          deleteMember={deleteMember}
          isAdding={isAdding}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          canManage={canManage}
          canVerify={canVerify}
        />
      </div>
    </PageShell>
  );
}
