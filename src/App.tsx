import { useOrganizationState, OrgTabsNavigation, OrgRecordsView } from "./modules/organisasi";
import { Input } from "./components/ui/input";
import { Search, Building2, Users, ShieldCheck, HeartHandshake, History } from "lucide-react";

export function OrganizationApp() {
  const {
    members,
    roles,
    skKas,
    auditLogs,
    totalMembers,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    cairkanSk,
  } = useOrganizationState();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">
                Tata Kelola & Organisasi DRG
              </h1>
              <p className="text-xs text-muted-foreground">
                Transparansi Anggota, Amanah Peran, SK Kas Gotong Royong, dan Jejak Audit Aktivitas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/70">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>
                <strong>{totalMembers}</strong> Anggota
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/70">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                <strong>{roles.length}</strong> Peran
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/70">
              <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
              <span>
                <strong>{skKas.length}</strong> SK Kas
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/70">
              <History className="h-3.5 w-3.5 text-blue-600" />
              <span>
                <strong>{auditLogs.length}</strong> Jejak Audit
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <OrgTabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            memberCount={members.length}
            roleCount={roles.length}
            skCount={skKas.length}
            auditCount={auditLogs.length}
          />

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari data & log organisasi..."
              className="h-8 pl-8 text-xs rounded-xl"
            />
          </div>
        </div>

        <OrgRecordsView
          activeTab={activeTab}
          members={members}
          roles={roles}
          skKas={skKas}
          auditLogs={auditLogs}
          onCairkanSk={cairkanSk}
        />
      </div>
    </div>
  );
}

export const App = OrganizationApp;
export default OrganizationApp;
