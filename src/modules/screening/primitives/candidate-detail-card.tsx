import { ScreeningApplication } from "../types";

interface Props {
  app: ScreeningApplication;
}

export function CandidateDetailCard({ app }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">HP</div>
        <div className="font-mono">{app.no_hp}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Email</div>
        <div>{app.email ?? "—"}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-muted-foreground">Alamat</div>
        <div>
          {app.alamat ?? "—"}, {app.kota ?? ""}
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-muted-foreground">Motivasi</div>
        <div>{app.motivasi ?? "—"}</div>
      </div>
    </div>
  );
}
