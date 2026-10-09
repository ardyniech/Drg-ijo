import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import type { FeatureNode } from "../data/feature-tree";

export function FeatureTreeNode({ node, isLast }: { node: FeatureNode; isLast: boolean }) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const fullLine = !isLast || hasChildren;

  return (
    <li className="relative">
      <span
        aria-hidden
        className={cn("absolute left-0 w-px bg-border", fullLine ? "top-0 h-full" : "top-0 h-5")}
      />
      <span aria-hidden className="absolute left-0 top-5 h-px w-4 bg-border" />

      <div className="ml-5 pb-2">
        <div className="rounded-xl border border-border/70 bg-card px-3 py-2 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={node.status} />
            <span className="text-sm font-semibold text-foreground">{node.label}</span>
          </div>
          {node.note && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
              {node.note}
            </p>
          )}
        </div>
      </div>

      {hasChildren && (
        <ul className="ml-4 flex flex-col">
          {node.children!.map((child, index) => (
            <FeatureTreeNode
              key={`${child.label}-${index}`}
              node={child}
              isLast={index === node.children!.length - 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
