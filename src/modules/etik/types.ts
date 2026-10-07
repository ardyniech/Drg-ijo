export type ViolationSeverity = "Ringan" | "Sedang" | "Berat";

export type EtikStatus = "investigating" | "mediation_scheduled" | "sanctioned" | "resolved";

export interface EtikCase {
  id: string;
  caseNumber: string;
  reportedMemberName: string;
  reportedMemberId: string;
  reporterName: string;
  category: string;
  severity: ViolationSeverity;
  description: string;
  incidentDate: string;
  location: string;
  status: EtikStatus;
  sanctionSummary?: string;
  mediationNotes?: string;
  createdAt: string;
}

export interface NewEtikCasePayload {
  reportedMemberName: string;
  reportedMemberId: string;
  category: string;
  severity: ViolationSeverity;
  description: string;
  location: string;
  incidentDate: string;
}
