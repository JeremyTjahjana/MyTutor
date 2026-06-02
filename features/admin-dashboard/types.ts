import type { TutorStatus, UserRole } from "@/types/user";

export type AdminTutorReviewMode = "pendaftaran" | "list-tutors";

export type TutorAdminItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  tutorStatus: TutorStatus | null;
  contractPdfName: string | null;
  contractPdfUrl: string | null;
  createdAt: string;
  bio: string;
  experience: string;
  costPerHour: number;
};

export type TutorReviewDecision = "approve" | "reject" | "revoke";

export type AdminTutorListState = {
  success: boolean;
  data?: TutorAdminItem[];
  error?: string;
};

export type TutorReviewMutationState = {
  success: boolean;
  error?: string;
};
