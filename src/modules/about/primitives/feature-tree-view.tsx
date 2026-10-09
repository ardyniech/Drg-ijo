import { UserCog, Siren, Wallet, Archive, Database, Sparkles, type LucideIcon } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { FeatureTreeNode } from "./feature-tree-node";
import {
  featureBranches,
  featureStatusMeta,
  featureTreeData,
  type FeatureStatus,
  type FeatureNode,
} from "../data/feature-tree";

const branchIcons: Record<string, LucideIcon> = {
  akun: UserCog,
  jalur: Siren,
  kas: Wallet,
  organisasi: Archive,
  data: Database,
};

function flatten(nodes: FeatureNode[]): FeatureNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flatten(node.children) : [])]);
}

export function FeatureTreeView() {
  const all = featureBranches.flatMap((branch) => flatten(branch.children));
  const count = (status: FeatureStatus) => all.filter((node) => node.status === status).length;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Pohon Fitur & Status
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Kesiapan Fitur Nyata dalam Aplikasi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Status diinspeksi secara otomatis dari modul, controller, dan storage yang aktif.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border/60 self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Auto-Verified: {featureTreeData.source}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {(["siap", "sebagian", "rencana"] as FeatureStatus[]).map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
        <span className="text-xs text-muted-foreground">
          <b className="text-foreground">{count("siap")}</b> siap ·{" "}
          <b className="text-foreground">{count("sebagian")}</b> sebagian ·{" "}
          <b className="text-foreground">{count("rencana")}</b> rencana
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {featureBranches.map((branch) => {
          const Icon = branchIcons[branch.id] ?? Database;
          return (
            <div
              key={branch.id}
              className="rounded-2xl border border-border/80 bg-muted/20 p-4 shadow-xs sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {branch.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">{branch.summary}</p>
                </div>
              </div>

              <ul className="mt-4 flex flex-col">
                {branch.children.map((child, index) => (
                  <FeatureTreeNode
                    key={`${child.label}-${index}`}
                    node={child}
                    isLast={index === branch.children.length - 1}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Keterangan status:{" "}
        {(["siap", "sebagian", "rencana"] as FeatureStatus[]).map((status, index) => (
          <span key={status}>
            {index > 0 && " · "}
            <b className="text-foreground">{featureStatusMeta[status].label}</b> —{" "}
            {status === "siap"
              ? "berfungsi penuh di perangkat ini"
              : status === "sebagian"
                ? "berjalan dengan batasan"
                : "belum tersedia"}
          </span>
        ))}
      </p>
    </section>
  );
}
