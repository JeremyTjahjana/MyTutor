/**
 * DB-aligned types for tutors.
 * All IDs are UUIDs (string). These mirror the Supabase schema exactly.
 */

// ─── Tutor List (browse page) ─────────────────────────────────────────────────

/** Tutor item as returned from the get_tutor_listings RPC */
export type TutorListItem = {
  id: string; // tutor_profiles.id (UUID)
  userId: string;
  name: string; // users.full_name
  bio: string;
  rating: number;
  subjects: string[]; // subject names
  avatarUrl: string | null;
  costPerHour: number;
  totalSessions: number;
};

export type TutorListFilters = {
  search?: string;
  subjectId?: string;
};

// ─── Tutor Detail ─────────────────────────────────────────────────────────────

export type Subject = {
  id: string;
  name: string;
  category: string | null;
};

/**
 * Recurring weekly availability slot from the `schedules` table.
 * dayOfWeek: 0 = Sunday, 1 = Monday, ... 6 = Saturday (JS Date convention)
 * startTime / endTime: "HH:MM:SS" strings (PostgreSQL TIME)
 */
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

/** Full tutor detail — used on the tutor profile page */
export type TutorDetail = {
  id: string; // tutor_profiles.id (UUID)
  userId: string; // tutor_profiles.user_id
  name: string; // users.full_name
  bio: string;
  rating: number;
  costPerHour: number;
  totalSessions: number;
  experience: string | null;
  avatarUrl: string | null;
  portfolioUrls: string[]; // tutor_profiles.portfolio_urls (JSONB)
  subjects: Subject[];
  schedules: Schedule[];
  testimonies: Testimony[];
};

/** Day-of-week number → Indonesian name */
export const DAY_NAMES: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

/** Indonesian day name → day-of-week number */
export const DAY_NUMBERS: Record<string, number> = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

/**
 * Given a schedule slot, returns the next occurrence DateTime as an ISO string.
 * Used to convert recurring schedules into bookable timestamps.
 */
export function nextOccurrence(dayOfWeek: number, timeStr: string): Date {
  const now = new Date();
  const todayDow = now.getDay(); // 0 = Sunday
  let daysUntil = (dayOfWeek - todayDow + 7) % 7;
  // If today matches but time already passed, go to next week
  if (daysUntil === 0) {
    const [h, m] = timeStr.split(":").map(Number);
    const slotMinutes = h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (slotMinutes <= nowMinutes) daysUntil = 7;
  }
  const date = new Date(now);
  date.setDate(now.getDate() + daysUntil);
  const [h, m, s] = timeStr.split(":").map(Number);
  date.setHours(h, m, s ?? 0, 0);
  return date;
}
