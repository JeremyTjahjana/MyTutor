// Re-export from central types — do not define types here directly.
export type { TutorTestimony, TutorSchedule } from "@/app/types/tutor";
// TutorDetail is an alias for Tutor so existing imports keep working.
export type { Tutor as TutorDetail } from "@/app/types/tutor";
