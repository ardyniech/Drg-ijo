import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  MemberFilters,
  MemberDirectoryGrid,
  MemberHeaderBar,
  AddMemberDialog,
  EditMemberDialog,
  DeleteMemberDialog,
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
    sortBy,
    setSortBy,
    pangkalanOptions,
    resetFilters,
    isLoading,
    canManage,
    addMember,
    updateMember,
    deleteMember,
    isAdding,
    isUpdating,
    isDeleting,
  } = useAnggota();

  return (
    <PageShell
      title="Direktori Anggota"
      description={`Basis data anggota resmi DRG (${stats.total} driver terdaftar), jenjang kaderisasi, dan manajemen pengurus.`}
    >
      <div className="space-y-4">
        <MemberHeaderBar
          total={stats.total}
          verified={stats.verified}
          pending={stats.pending}
          pangkalan={stats.pangkalan}
          canManage={canManage}
          onAddClick={() => setIsAddOpen(true)}
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
          sortBy={sortBy}
          setSortBy={setSortBy}
          pangkalanOptions={pangkalanOptions}
        />

        <MemberDirectoryGrid
          members={members}
          isLoading={isLoading}
          onResetFilters={resetFilters}
          canManage={canManage}
          onEditMember={(m) => setEditingMember(m)}
          onDeleteMember={(m) => setDeletingMember(m)}
        />

        <AddMemberDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onAdd={addMember}
          isAdding={isAdding}
        />

        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={updateMember}
          isUpdating={isUpdating}
        />

        <DeleteMemberDialog
          member={deletingMember}
          open={!!deletingMember}
          onOpenChange={(open) => !open && setDeletingMember(null)}
          onConfirmDelete={deleteMember}
          isDeleting={isDeleting}
        />
      </div>
    </PageShell>
  );
}
