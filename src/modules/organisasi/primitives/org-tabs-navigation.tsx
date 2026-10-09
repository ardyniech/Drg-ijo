import { Users, ShieldCheck, HeartHandshake, History } from "lucide-react";
import { OrgTab } from "../types";

interface OrgTabsNavigationProps {
  activeTab: OrgTab;
  onTabChange: (tab: OrgTab) => void;
  memberCount: number;
  roleCount: number;
  skCount: number;
  auditCount?: number;
}

export function OrgTabsNavigation({
  activeTab,
  onTabChange,
  memberCount,
  roleCount,
  skCount,
  auditCount = 0,
}: OrgTabsNavigationProps) {
  const tabs = [
    { id: "members" as OrgTab, label: "Anggota Komunitas", count: memberCount, icon: Users },
    { id: "roles" as OrgTab, label: "Amanah Peran", count: roleCount, icon: ShieldCheck },
    { id: "sk_kas" as OrgTab, label: "SK Kas Gotong Royong", count: skCount, icon: HeartHandshake },
    { id: "audit_log" as OrgTab, label: "Jejak Transparansi", count: auditCount, icon: History },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted p-1 text-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
