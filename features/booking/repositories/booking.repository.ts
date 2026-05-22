import { supabase } from "@/lib/supabase/server";
import type { Booking } from "@/types/user";

function one<T>(arr: T[] | T | null | undefined): T | null {
  if (arr == null) return null;
  if (Array.isArray(arr)) return arr[0] ?? null;
  return arr;
}

// ─── Student Bookings

export async function fetchBookingsByStudentId(
  studentId: string,
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, student_id, tutor_profile_id, subject_id, start_time, end_time,
       status, student_completed_at, tutor_completed_at, notes, created_at,
       subjects(name),
       tutor_profiles(users!tutor_profiles_user_id_fkey(full_name, avatar_url, phone)),
       testimonies(id, rating, message, created_at)`,
    )
    .eq("student_id", studentId)
    .order("start_time", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const subject = one(row.subjects as unknown as { name: string }[] | null);
    const tutorProfile = one(
      row.tutor_profiles as unknown as
        | {
            users: { full_name: string; avatar_url: string | null; phone: string | null }[];
          }[]
        | null,
    );
    const tutorUser = one(tutorProfile?.users ?? null);
    const testimony = one(
      row.testimonies as unknown as
        | { id: string; rating: number; message: string | null; created_at: string }[]
        | null,
    );

    return {
      id: row.id as string,
      studentId: row.student_id as string,
      tutorProfileId: row.tutor_profile_id as string,
      subjectId: row.subject_id as string,
      subjectName: subject?.name ?? "—",
      tutorName: tutorUser?.full_name ?? "—",
      tutorAvatarUrl: tutorUser?.avatar_url ?? null,
      tutorPhone: tutorUser?.phone ?? null,
      startTime: row.start_time as string,
      endTime: row.end_time as string,
      status: row.status as Booking["status"],
      studentCompletedAt: (row.student_completed_at as string | null) ?? null,
      tutorCompletedAt: (row.tutor_completed_at as string | null) ?? null,
      notes: row.notes as string | null,
      createdAt: row.created_at as string,
      hasTestimony: Boolean(testimony),
      testimonyRating: testimony?.rating ?? null,
      testimonyMessage: testimony?.message ?? null,
    };
  });
}

// ─── Tutor Bookings

export async function fetchBookingsByTutorProfileId(
  tutorProfileId: string,
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, student_id, tutor_profile_id, subject_id, start_time, end_time,
       status, student_completed_at, tutor_completed_at, notes, created_at,
       subjects(name),
       users!bookings_student_id_fkey(full_name, avatar_url, phone),
       testimonies(id, rating, message, created_at)`,
    )
    .eq("tutor_profile_id", tutorProfileId)
    .order("start_time", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const subject = one(row.subjects as unknown as { name: string }[] | null);
    const studentUser = one(
      row.users as unknown as
        | {
            full_name: string;
            avatar_url: string | null;
            phone: string | null;
          }[]
        | null,
    );
    const testimony = one(
      row.testimonies as unknown as
        | { id: string; rating: number; message: string | null; created_at: string }[]
        | null,
    );

    return {
      id: row.id as string,
      studentId: row.student_id as string,
      tutorProfileId: row.tutor_profile_id as string,
      subjectId: row.subject_id as string,
      subjectName: subject?.name ?? "—",
      tutorName: studentUser?.full_name ?? "—",
      tutorAvatarUrl: studentUser?.avatar_url ?? null,
      tutorPhone: studentUser?.phone ?? null,
      startTime: row.start_time as string,
      endTime: row.end_time as string,
      status: row.status as Booking["status"],
      studentCompletedAt: (row.student_completed_at as string | null) ?? null,
      tutorCompletedAt: (row.tutor_completed_at as string | null) ?? null,
      notes: row.notes as string | null,
      createdAt: row.created_at as string,
      hasTestimony: Boolean(testimony),
      testimonyRating: testimony?.rating ?? null,
      testimonyMessage: testimony?.message ?? null,
    };
  });
}

// ─── Create Booking

export type CreateBookingInput = {
  studentId: string;
  tutorProfileId: string;
  subjectId: string;
  scheduleId?: string; // optional for backward compat, used for slot matching
  startTime: string; // ISO timestamp
  endTime: string;
  notes?: string;
  studentCount?: number;
  sessionCount?: number;
};

export async function insertBooking(
  input: CreateBookingInput,
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      student_id: input.studentId,
      tutor_profile_id: input.tutorProfileId,
      subject_id: input.subjectId,
      schedule_id: input.scheduleId ?? null,
      start_time: input.startTime,
      end_time: input.endTime,
      notes: input.notes ?? null,
      status: "pending",
      student_count: input.studentCount ?? 1,
      session_count: input.sessionCount ?? 1,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

// ─── Create Testimony

export type CreateTestimonyInput = {
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  rating: number;
  message?: string | null;
};

export async function insertTestimony(input: CreateTestimonyInput): Promise<void> {
  // 1. Insert the testimony
  const { error: insertError } = await supabase.from("testimonies").insert({
    booking_id: input.bookingId,
    student_id: input.studentId,
    tutor_profile_id: input.tutorProfileId,
    rating: input.rating,
    message: input.message ?? null,
  });

  if (insertError) throw insertError;

  // 2. Calculate average rating from all testimonies for this tutor
  const { data: testimonies, error: fetchError } = await supabase
    .from("testimonies")
    .select("rating")
    .eq("tutor_profile_id", input.tutorProfileId);

  if (fetchError) throw fetchError;

  const averageRating = testimonies && testimonies.length > 0
    ? testimonies.reduce((sum, t) => sum + t.rating, 0) / testimonies.length
    : 0;

  // 3. Update the rating in tutor_profiles
  const { error: updateError } = await supabase
    .from("tutor_profiles")
    .update({ rating: parseFloat(averageRating.toFixed(2)) })
    .eq("id", input.tutorProfileId);

  if (updateError) throw updateError;
}

// ─── Update Booking Status

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "completed" | "cancelled",
): Promise<void> {
  const update =
    status === "accepted"
      ? { status, student_completed_at: null, tutor_completed_at: null }
      : { status };

  const { error } = await supabase.from("bookings").update(update).eq("id", bookingId);

  if (error) throw error;
}

export async function confirmBookingCompletion(
  bookingId: string,
  actor: "student" | "tutor",
): Promise<void> {
  const completedAtColumn =
    actor === "student" ? "student_completed_at" : "tutor_completed_at";
  const now = new Date().toISOString();

  const { error: confirmError } = await supabase
    .from("bookings")
    .update({ [completedAtColumn]: now })
    .eq("id", bookingId)
    .eq("status", "accepted")
    .is(completedAtColumn, null);

  if (confirmError) throw confirmError;

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, student_completed_at, tutor_completed_at")
    .eq("id", bookingId)
    .single();

  if (fetchError) throw fetchError;
  if (
    !booking ||
    booking.status !== "accepted" ||
    !booking.student_completed_at ||
    !booking.tutor_completed_at
  ) {
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("status", "accepted");

  if (error) throw error;
}

// ─── Slot Status for Schedule Page

export type SlotStatus = {
  pendingCount: number;
  hasAccepted: boolean;
};

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function toWIB(iso: string): { dow: number; timeStr: string } {
  const utcMs = new Date(iso).getTime();
  const wib = new Date(utcMs + WIB_OFFSET_MS);
  const dow = wib.getUTCDay();
  const hh = String(wib.getUTCHours()).padStart(2, "0");
  const mm = String(wib.getUTCMinutes()).padStart(2, "0");
  return { dow, timeStr: `${hh}:${mm}` };
}

export async function fetchSlotStatuses(
  tutorProfileId: string,
): Promise<Record<string, SlotStatus>> {
  // Fetch schedules to know the day/time signature of each slot
  const { data: schedules } = await supabase
    .from("schedules")
    .select("id, day_of_week, start_time")
    .eq("tutor_profile_id", tutorProfileId);

  // Fetch ALL active bookings (with or without schedule_id)
  const { data: bookings } = await supabase
    .from("bookings")
    .select("schedule_id, start_time, status")
    .eq("tutor_profile_id", tutorProfileId)
    .in("status", ["pending", "accepted"]);

  const result: Record<string, SlotStatus> = {};

  for (const schedule of schedules ?? []) {
    result[schedule.id] = { pendingCount: 0, hasAccepted: false };
    const scheduleTimeStr = schedule.start_time.slice(0, 5); // "HH:MM"

    for (const b of bookings ?? []) {
      let matches = false;

      if (b.schedule_id) {
        // Exact match via schedule_id
        matches = b.schedule_id === schedule.id;
      } else {
        // Fallback: match by WIB day-of-week + start time
        const { dow, timeStr } = toWIB(b.start_time as string);
        matches = dow === schedule.day_of_week && timeStr === scheduleTimeStr;
      }

      if (matches) {
        if (b.status === "pending") result[schedule.id].pendingCount++;
        if (b.status === "accepted") result[schedule.id].hasAccepted = true;
      }
    }
  }

  return result;
}
