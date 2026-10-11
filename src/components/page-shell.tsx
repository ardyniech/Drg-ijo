import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  const effectiveActions = actions ?? action;

  return (
    <div className="mx-auto w-full max-w-7xl px-3.5 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          {eyebrow && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {effectiveActions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {effectiveActions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
