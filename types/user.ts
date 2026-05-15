/**
 * DB-aligned user types.
 * Mirrors the `users` and `bookings` tables in Supabase.
 */

export type UserRole = "student" | "tutor" | "admin";
export type TutorStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

/** Mirrors public.users */
export interface User {
  id: string; // UUID from auth.users
  fullName: string; // users.full_name
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  tutorStatus: TutorStatus | null;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors public.bookings with joined subject + tutor/student name */
export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  subjectId: string;
  subjectName: string;
  /** In student context: the tutor's name. In tutor context: the student's name. */
  tutorName: string;
  tutorAvatarUrl: string | null;
  tutorPhone: string | null;
  startTime: string; // ISO timestamp
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
}
