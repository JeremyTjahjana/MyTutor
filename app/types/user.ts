export type UserRole = "student" | "tutor";
export type TutorStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tutorStatus?: TutorStatus;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorProfile {
  userId: string;
  experience: string;
  subject: string;
  costPerHour: number;
  bio?: string;
  portfolio?: string;
  rating: number;
  totalSessions: number;
  totalEarnings: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subject: string;
  lastSession?: Date;
  totalSessions: number;
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "accepted" | "completed" | "rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
