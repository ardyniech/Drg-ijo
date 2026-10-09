import { UserRole } from "@/hooks/use-me";

export type ActivityModule =
  | "roles"
  | "kas"
  | "kejadian"
  | "piket"
  | "notulen"
  | "etik"
  | "persetujuan"
  | "auth"
  | "anggota"
  | "organisasi";

export interface ActivityLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: ActivityModule;
  description: string;
  targetId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
