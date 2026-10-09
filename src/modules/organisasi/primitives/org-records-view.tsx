import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord } from "@/modules/kas";
import { ActivityLogEntry } from "@/modules/activity-log/types";
import { OrgTab, OrgRoleSummary } from "../types";
import { OrgRolesGrid } from "./org-roles-grid";
import { OrgSkKasTable } from "./org-sk-kas-table";
import { OrgMembersTable } from "./org-members-table";
import { OrgAuditLogView } from "./org-audit-log-view";

interface OrgRecordsViewProps {
  activeTab: OrgTab;
  members: MemberRecord[];
  roles: OrgRoleSummary[];
  skKas: KasSkRecord[];
  auditLogs?: ActivityLogEntry[];
  onCairkanSk: (id: string) => void;
}

export function OrgRecordsView({
  activeTab,
  members,
  roles,
  skKas,
  auditLogs = [],
  onCairkanSk,
}: OrgRecordsViewProps) {
  if (activeTab === "roles") {
    return <OrgRolesGrid roles={roles} />;
  }

  if (activeTab === "sk_kas") {
    return <OrgSkKasTable skKas={skKas} onCairkanSk={onCairkanSk} />;
  }

  if (activeTab === "audit_log") {
    return <OrgAuditLogView logs={auditLogs} />;
  }

  return <OrgMembersTable members={members} />;
}
