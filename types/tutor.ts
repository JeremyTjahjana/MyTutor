/**
 * DB-aligned types for tutors.
 * All IDs are UUID strings and mirror the Supabase schema.
 */

export type TutorListItem = {
  id: string;
  userId: string;
  name: string;
  bio: string;
  rating: number;
  subjects: string[];
  avatarUrl: string | null;
  costPerHour: number;
  totalSessions: number;
};

export type TutorListFilters = {
  search?: string;
  subjectId?: string;
};

export type Subject = {
  id: string;
  name: string;
  category: string | null;
};

export type Schedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type Testimony = {
  id: string;
  studentName: string;
  rating: number;
  message: string | null;
  createdAt: string;
};

export type TutorDetail = {
  id: string;
  userId: string;
  name: string;
  bio: string;
  rating: number;
  costPerHour: number;
  totalSessions: number;
  experience: string | null;
  avatarUrl: string | null;
  portfolioUrls: string[];
  subjects: Subject[];
  schedules: Schedule[];
  testimonies: Testimony[];
};
