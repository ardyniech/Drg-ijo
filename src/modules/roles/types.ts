import { LucideIcon } from "lucide-react";
import { UserRole } from "@/hooks/use-me";

export type RoleCategory = "pengurus_inti" | "lapangan" | "pengawas" | "anggota";

export interface RolePermission {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface RoleDefinition {
  id: UserRole;
  name: string;
  title: string;
  category: RoleCategory;
  level: number;
  description: string;
  badgeClass: string;
  permissions: string[];
}

export interface MemberRoleRecord {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  pangkalan: string;
  role: UserRole;
  jenjang: string;
  status: "aktif" | "pending_review" | "nonaktif";
  assignedAt?: string;
  assignedBy?: string;
  skNumber?: string;
}

export interface RoleAuditLog {
  id: string;
  targetUserId: string;
  targetUserName: string;
  fromRole: UserRole;
  toRole: UserRole;
  changedBy: string;
  changedByName: string;
  timestamp: string;
  skNumber?: string;
  notes?: string;
}
