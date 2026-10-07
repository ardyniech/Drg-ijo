import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Swap } from "../types";

interface Props {
  swaps: Swap[];
  currentUserId?: string;
  onRespond: (payload: {
    id: string;
    accept: boolean;
    shiftId: string;
    requestedBy: string;
  }) => void;
}

export function PiketSwapList({ swaps, currentUserId, onRespond }: Props) {
  if (swaps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-3 font-display text-lg font-bold">Permintaan tukar shift</h3>
      <ul className="space-y-2">
        {swaps.map((sw) => {
          const incoming = sw.target_user_id === currentUserId && sw.status === "menunggu";
          return (
            <li
              key={sw.id}
              className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
            >
              <div>
                <div className="font-semibold capitalize">{sw.status}</div>
                {sw.alasan && <div className="text-xs text-muted-foreground">{sw.alasan}</div>}
              </div>
              {incoming && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onRespond({
                        id: sw.id,
                        accept: true,
                        shiftId: sw.shift_id,
                        requestedBy: sw.requested_by,
                      })
                    }
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onRespond({
                        id: sw.id,
                        accept: false,
                        shiftId: sw.shift_id,
                        requestedBy: sw.requested_by,
                      })
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
