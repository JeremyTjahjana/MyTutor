import { supabase } from "@/lib/supabase/server";
import type { TutorListItem } from "@/types/tutor";
import type { TutorDetail, Subject, Schedule, Testimony } from "@/types/tutor";
import { subjectNameCategoryMatch } from "@/lib/subject-utils";

export { subjectNameCategoryMatch };

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

/**
 * PostgREST join behavior:
 * - Many-to-one (FK on source table, e.g. tutor_profiles.user_id → users.id)
 *   → returns a SINGLE embedded object  { full_name: "..." }
 * - One-to-many (FK on related table, reverse join)
 *   → returns an ARRAY [ { ... } ]
 * This helper handles both cases safely.
 */
function unwrapJoin<T>(join: unknown): T | null {
  if (!join) return null;
  if (Array.isArray(join)) return (join[0] as T) ?? null;
  return join as T;
}

// ─── Tutor Listings (public browse) ─────────────────────────────────────────

type TutorListingRpcRow = {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  rating: number | string;
  cost_per_hour: number | string;
  total_sessions: number;
  avatar_url: string | null;
  subject_ids: string[];
  subject_names: string[];
};

export async function fetchTutorListings(): Promise<TutorListItem[]> {
  const { data, error } = await supabase.rpc("get_tutor_listings");
  if (error) throw error;

  return ((data ?? []) as TutorListingRpcRow[]).map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    bio: row.bio,
    rating: toNumber(row.rating),
    costPerHour: toNumber(row.cost_per_hour),
    totalSessions: row.total_sessions,
    avatarUrl: row.avatar_url,
    subjects: row.subject_names ?? [],
  }));
}

// ─── Single Tutor Detail ─────────────────────────────────────────────────────

export async function fetchTutorById(
  tutorProfileId: string,
): Promise<TutorDetail | null> {
  // 1. Tutor profile + user info
  const { data: profile, error: profileError } = await supabase
    .from("tutor_profiles")
    .select(
      `id, user_id, bio, experience, cost_per_hour, rating, total_sessions,
       portfolio_urls,
       users!tutor_profiles_user_id_fkey(full_name, avatar_url, role, tutor_status)`,
    )
    .eq("id", tutorProfileId)
    .single();

  if (profileError || !profile) {
    console.error("fetchTutorById: profile query error", profileError);
    return null;
  }

  const user = unwrapJoin<{
    full_name: string;
    avatar_url: string | null;
    role?: string;
    tutor_status?: string | null;
  }>(profile.users);
  if (!user)
    console.warn(
      "fetchTutorById: users join returned null for profile",
      tutorProfileId,
    );

  // 2. Subjects
  const { data: subjectRows, error: subjectError } = await supabase
    .from("tutor_subjects")
    .select("subject_id, subjects(id, name, category)")
    .eq("tutor_profile_id", tutorProfileId);

  if (subjectError)
    console.error("fetchTutorById: tutor_subjects query error", subjectError);
  else if (!subjectRows?.length)
    console.warn("fetchTutorById: no subjects found for", tutorProfileId);

  const subjects: Subject[] = (subjectRows ?? [])
    .map((row) => {
      const s = unwrapJoin<{
        id: string;
        name: string;
        category: string | null;
      }>(row.subjects);
      if (!s) return null;
      return { id: s.id, name: s.name, category: s.category };
    })
    .filter(Boolean) as Subject[];

  // 3. Schedules
  const { data: scheduleRows } = await supabase
    .from("schedules")
    .select("id, day_of_week, start_time, end_time, is_available")
    .eq("tutor_profile_id", tutorProfileId)
    .eq("is_available", true)
    .order("day_of_week")
    .order("start_time");

  const schedules: Schedule[] = (scheduleRows ?? []).map((row) => ({
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    isAvailable: row.is_available,
  }));

  // 4. Testimonies (joined with users for student name)
  const { data: testimonyRows } = await supabase
    .from("testimonies")
    .select(
      "id, rating, message, created_at, users!testimonies_student_id_fkey(full_name)",
    )
    .eq("tutor_profile_id", tutorProfileId)
    .order("created_at", { ascending: false })
    .limit(20);

  const testimonies: Testimony[] = (testimonyRows ?? []).map((row) => {
    const student = unwrapJoin<{ full_name: string }>(row.users);
    return {
      id: row.id,
      studentName: student?.full_name ?? "Anonim",
      rating: row.rating,
      message: row.message,
      createdAt: row.created_at,
    };
  });

  const portfolioUrls = Array.isArray(profile.portfolio_urls)
    ? (profile.portfolio_urls as string[])
    : [];

  return {
    id: profile.id,
    userId: profile.user_id,
    name: user.full_name,
    bio: profile.bio ?? "",
    rating: toNumber(profile.rating),
    costPerHour: toNumber(profile.cost_per_hour),
    totalSessions: profile.total_sessions,
    experience: profile.experience,
    avatarUrl: user.avatar_url ?? null,
    portfolioUrls,
    subjects,
    schedules,
    testimonies,
  };
}

// ─── Tutor Profile by User ID ────────────────────────────────────────────────

export async function fetchTutorProfileByUserId(userId: string) {
  const { data, error } = await supabase
    .from("tutor_profiles")
    .select(
      `id, bio, experience, cost_per_hour, rating, total_sessions, total_earnings, portfolio_urls`,
    )
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

// ─── Schedules for Tutor ─────────────────────────────────────────────────────

export async function fetchSchedulesByTutorProfileId(
  tutorProfileId: string,
): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select("id, day_of_week, start_time, end_time, is_available")
    .eq("tutor_profile_id", tutorProfileId)
    .order("day_of_week")
    .order("start_time");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    isAvailable: row.is_available,
  }));
}

// ─── Update Tutor Profile ────────────────────────────────────────────────────

export type UpdateTutorProfileInput = {
  bio?: string;
  experience?: string;
  costPerHour?: number;
  portfolioUrls?: string[];
};

export async function updateTutorProfile(
  tutorProfileId: string,
  input: UpdateTutorProfileInput,
): Promise<void> {
  const updateData: Record<string, unknown> = {};
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.experience !== undefined) updateData.experience = input.experience;
  if (input.costPerHour !== undefined)
    updateData.cost_per_hour = input.costPerHour;
  if (input.portfolioUrls !== undefined)
    updateData.portfolio_urls = input.portfolioUrls;

  const { error } = await supabase
    .from("tutor_profiles")
    .update(updateData)
    .eq("id", tutorProfileId);

  if (error) throw error;
}

// ─── Update Schedule ─────────────────────────────────────────────────────────

export type UpdateScheduleInput = {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
};

export async function updateSchedule(
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<void> {
  const updateData: Record<string, unknown> = {};
  if (input.dayOfWeek !== undefined) updateData.day_of_week = input.dayOfWeek;
  if (input.startTime !== undefined) updateData.start_time = input.startTime;
  if (input.endTime !== undefined) updateData.end_time = input.endTime;
  if (input.isAvailable !== undefined)
    updateData.is_available = input.isAvailable;

  const { error } = await supabase
    .from("schedules")
    .update(updateData)
    .eq("id", scheduleId);

  if (error) throw error;
}

// ─── Create Schedule ─────────────────────────────────────────────────────────

export type CreateScheduleInput = {
  tutorProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export async function createSchedule(
  input: CreateScheduleInput,
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      tutor_profile_id: input.tutorProfileId,
      day_of_week: input.dayOfWeek,
      start_time: input.startTime,
      end_time: input.endTime,
      is_available: true,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

// ─── Delete Schedule ─────────────────────────────────────────────────────────

export async function deleteSchedule(scheduleId: string): Promise<void> {
  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", scheduleId);

  if (error) throw error;
}

// ─── Subjects (catalog + tutor links) ───────────────────────────────────────
/** Skema SQL: `database/subjects_and_tutor_subjects.pgsql` (Supabase SQL Editor). */

/** Subjects already linked to this tutor profile. */
export async function fetchTutorSubjectsByProfileId(
  tutorProfileId: string,
): Promise<Subject[]> {
  const { data: subjectRows, error } = await supabase
    .from("tutor_subjects")
    .select("subject_id, subjects(id, name, category)")
    .eq("tutor_profile_id", tutorProfileId);

  if (error) throw error;

  return (subjectRows ?? [])
    .map((row) => {
      const s = unwrapJoin<{
        id: string;
        name: string;
        category: string | null;
      }>(row.subjects);
      if (!s) return null;
      return { id: s.id, name: s.name, category: s.category };
    })
    .filter(Boolean) as Subject[];
}

/** Browse `subjects` for pickers (optional substring search). */
export async function fetchSubjectsCatalog(
  search?: string,
  options?: { limit?: number },
): Promise<Subject[]> {
  const t = search?.trim();
  const safe = t ? t.replace(/%/g, "").replace(/_/g, "") : "";
  const limit = Math.min(options?.limit ?? (safe.length > 0 ? 120 : 150), 500);

  let q = supabase.from("subjects").select("id, name, category");

  if (safe.length > 0) {
    q = q
      .ilike("name", `%${safe}%`)
      .order("name", { ascending: true })
      .limit(limit);
  } else {
    // Tanpa teks pencarian: urutkan terbaru dulu agar skill baru (mis. dari tutor lain) tetap terlihat,
    // bukan hanya 40 pertama alfabetis.
    q = q.order("created_at", { ascending: false }).limit(limit);
  }

  const { data, error } = await q;

  if (error) {
    if (safe.length === 0) {
      const { data: fallback, error: err2 } = await supabase
        .from("subjects")
        .select("id, name, category")
        .order("name", { ascending: true })
        .limit(limit);
      if (err2) throw err2;
      return (fallback ?? []).map((row) => ({
        id: row.id as string,
        name: row.name as string,
        category: (row.category as string | null) ?? null,
      }));
    }
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    category: (row.category as string | null) ?? null,
  }));
}

/**
 * Cari baris subjects dengan pasangan (nama, kategori) yang sama (abaikan kapitalisasi).
 * Jika tidak ada, insert baru. Mendukung beberapa baris dengan nama sama asalkan kategori beda.
 */
export async function resolveOrCreateSubjectIdByName(
  name: string,
  category?: string | null,
): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const catTrim = category?.trim() ? category.trim() : null;

  const { data: candidates, error: findErr } = await supabase
    .from("subjects")
    .select("id, name, category")
    .ilike("name", trimmed);

  if (findErr) {
    console.error("resolveOrCreateSubjectIdByName find:", findErr);
    return null;
  }

  const existing = (candidates ?? []).find((row) =>
    subjectNameCategoryMatch(trimmed, catTrim, row.name, row.category),
  );

  if (existing?.id) {
    return existing.id as string;
  }

  const insertRow = {
    name: trimmed,
    category: catTrim as string | null,
  };

  const { data: created, error } = await supabase
    .from("subjects")
    .insert(insertRow)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: again } = await supabase
        .from("subjects")
        .select("id, name, category")
        .ilike("name", trimmed);
      const hit = (again ?? []).find((row) =>
        subjectNameCategoryMatch(trimmed, catTrim, row.name, row.category),
      );
      return (hit?.id as string | undefined) ?? null;
    }
    console.error("resolveOrCreateSubjectIdByName insert:", error);
    return null;
  }
  return created.id as string;
}

export async function linkTutorSubject(
  tutorProfileId: string,
  subjectId: string,
): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  const { error } = await supabase.from("tutor_subjects").insert({
    tutor_profile_id: tutorProfileId,
    subject_id: subjectId,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        code: "duplicate",
        message: "Mata kuliah ini sudah ada di daftar Anda.",
      };
    }
    return { ok: false, code: error.code ?? "unknown", message: error.message };
  }
  return { ok: true };
}

export async function unlinkTutorSubject(
  tutorProfileId: string,
  subjectId: string,
): Promise<void> {
  const { error } = await supabase
    .from("tutor_subjects")
    .delete()
    .eq("tutor_profile_id", tutorProfileId)
    .eq("subject_id", subjectId);

  if (error) throw error;
}
