import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MemberCard, MemberFilters, useAnggota } from "@/modules/anggota";
import { Users, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/anggota")({
  component: AnggotaPage,
});

function AnggotaPage() {
  const {
    members,
    totalCount,
    search,
    setSearch,
    selectedPangkalan,
    setSelectedPangkalan,
    selectedRole,
    setSelectedRole,
    resetFilters,
    isLoading,
  } = useAnggota();

  return (
    <PageShell
      title="Direktori Anggota"
      description={`Basis data anggota resmi DRG (${totalCount} anggota terdaftar), jenjang kaderisasi, dan KTA digital.`}
    >
      <div className="space-y-6">
        <MemberFilters
          search={search}
          setSearch={setSearch}
          selectedPangkalan={selectedPangkalan}
          setSelectedPangkalan={setSelectedPangkalan}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat data anggota...</p>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-muted-foreground">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-foreground">
              Tidak ada anggota yang cocok dengan filter.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba sesuaikan kata kunci pencarian atau reset filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-4 gap-1.5 rounded-xl text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Semua Filter
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
