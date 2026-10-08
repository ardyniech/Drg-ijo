import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  useRoleManagement,
  RoleStatsCards,
  RoleMembersTable,
  RoleAssignDialog,
  RolePermissionsMatrix,
  RoleAuditLogCard,
} from "@/modules/roles";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/roles")({
  component: RoleManagementPage,
});

function RoleManagementPage() {
  const {
    members,
    auditLogs,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    selectedMember,
    setSelectedMember,
    assignMutation,
    stats,
    currentActor,
  } = useRoleManagement();

  const [tab, setTab] = useState<"members" | "matrix" | "audit">("members");

  const canEdit =
    currentActor?.role === "ketua" ||
    currentActor?.role === "admin" ||
    currentActor?.role === "super_admin" ||
    currentActor?.role === "sekretaris";

  return (
    <PageShell
      title="Amanah Pengurus & Struktur Sedulur"
      description="Pemberian amanah organisasi keluarga besar DRG: Ketua, Sekretaris, Bendahara Kas, Satgas Lapangan, Dewan Etik Jalur, dan Korlap Pangkalan."
    >
      <div className="space-y-6">
        <RoleStatsCards stats={stats} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as "members" | "matrix" | "audit")}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto text-xs">
              <TabsTrigger value="members">Daftar Dulur Pengurus</TabsTrigger>
              <TabsTrigger value="matrix">Kewenangan Fitur</TabsTrigger>
              <TabsTrigger value="audit">Riwayat Serah Terima</TabsTrigger>
            </TabsList>

            {tab === "members" && (
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama / email..."
                    className="h-9 pl-8 text-xs rounded-xl"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 rounded-xl border border-border bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="pengurus_inti">Pengurus Inti</option>
                  <option value="lapangan">Satgas & Korlap</option>
                  <option value="pengawas">Dewan Etik</option>
                  <option value="anggota">Driver Anggota</option>
                </select>
              </div>
            )}
          </div>

          <TabsContent value="members" className="mt-4">
            <RoleMembersTable
              members={members}
              onSelectMember={setSelectedMember}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="matrix" className="mt-4">
            <RolePermissionsMatrix />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <RoleAuditLogCard logs={auditLogs} />
          </TabsContent>
        </Tabs>

        <RoleAssignDialog
          member={selectedMember}
          open={Boolean(selectedMember)}
          onOpenChange={(open) => !open && setSelectedMember(null)}
          onAssign={(params) => assignMutation.mutate(params)}
          isLoading={assignMutation.isPending}
        />
      </div>
    </PageShell>
  );
}
