export type JenjangLevel = "Calon" | "Muda" | "Madya" | "Utama" | "Kehormatan";

export interface JenjangRequirement {
  id: string;
  label: string;
  met: boolean;
  score: number;
}

export interface MemberKaderisasi {
  id: string;
  memberId: string;
  fullName: string;
  currentLevel: JenjangLevel;
  targetLevel: JenjangLevel;
  joinedAt: string;
  piketAttendanceCount: number;
  kasCompliancePercent: number;
  points: number;
  status: "eligible" | "in_review" | "promoted" | "needs_improvement";
  lastEvaluatedAt?: string;
  evaluatorNotes?: string;
  requirements: JenjangRequirement[];
}
