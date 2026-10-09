import { recordActivityLog } from "@/modules/activity-log";
import { UserRole } from "@/hooks/use-me";

export function logMemberActivity(
  action: string,
  desc: string,
  targetId?: string,
  actorRole?: string,
) {
  recordActivityLog({
    actorId: "usr-pengurus",
    actorName: "Pengurus Harian DRG",
    actorRole: (actorRole as UserRole) || "admin",
    action,
    module: "anggota",
    description: desc,
    targetId,
  });
}
