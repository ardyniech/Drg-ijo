export type ApprovalType = "registrasi_baru" | "mutasi_pangkalan" | "perubahan_role";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  plateNumber: string;
  appliedBase: string;
  appliedRole: string;
  currentBase?: string;
  status: ApprovalStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}
