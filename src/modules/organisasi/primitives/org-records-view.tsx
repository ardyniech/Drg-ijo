import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord } from "@/modules/kas";
import { OrgTab, OrgRoleSummary } from "../types";
import { OrgRolesGrid } from "./org-roles-grid";
import { OrgSkKasTable } from "./org-sk-kas-table";
import { OrgMembersTable } from "./org-members-table";

interface OrgRecordsViewProps {
  activeTab: OrgTab;
  members: MemberRecord[];
  roles: OrgRoleSummary[];
  skKas: KasSkRecord[];
  onCairkanSk: (id: string) => void;
}

export function OrgRecordsView({
  activeTab,
  members,
  roles,
  skKas,
  onCairkanSk,
}: OrgRecordsViewProps) {
  if (activeTab === "roles") {
    return <OrgRolesGrid roles={roles} />;
  }

  if (activeTab === "sk_kas") {
    return <OrgSkKasTable skKas={skKas} onCairkanSk={onCairkanSk} />;
  }

  return <OrgMembersTable members={members} />;
}
