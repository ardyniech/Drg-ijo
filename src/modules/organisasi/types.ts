import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord } from "@/modules/kas/types";

export type OrgTab = "members" | "roles" | "sk_kas";

export interface OrgRoleSummary {
  role: string;
  label: string;
  count: number;
  sk_mandat: string;
  pejabat: string;
}

export interface OrganizationState {
  members: MemberRecord[];
  roles: OrgRoleSummary[];
  skKas: KasSkRecord[];
  activeTab: OrgTab;
  search: string;
  isLoading: boolean;
}
