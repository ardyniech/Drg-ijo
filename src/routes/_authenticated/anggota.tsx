import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  MemberFilters,
  MemberDirectoryStats,
  MemberDirectoryGrid,
  useAnggota,
} from "@/modules/anggota";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/anggota")({
  component: AnggotaPage,
});

function AnggotaPage() {
  const { me } = useMe();
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
    verifyMember,
  } = useAnggota();

  const canVerify =
    !!me?.role && ["ketua", "admin", "super_admin", "dewan_etik", "satgas"].includes(me.role);

  return (
    <PageShell
      title="Direktori Anggota"
      description={`Basis data anggota resmi DRG (${stats.total} driver terdaftar), jenjang kaderisasi, status verifikasi, dan KTA digital.`}
    >
      <div className="space-y-4">
        <MemberDirectoryStats
          total={stats.total}
          verifiedCount={stats.verified}
          pendingCount={stats.pending}
          pangkalanCount={stats.pangkalan}
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
          onVerifyMember={verifyMember}
          canVerify={canVerify}
        />
      </div>
    </PageShell>
  );
}
