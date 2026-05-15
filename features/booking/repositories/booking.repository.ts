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
       status, notes, created_at,
       subjects(name),
       tutor_profiles(users!tutor_profiles_user_id_fkey(full_name, avatar_url, phone))`,
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
      notes: row.notes as string | null,
      createdAt: row.created_at as string,
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
       status, notes, created_at,
       subjects(name),
       users!bookings_student_id_fkey(full_name, avatar_url, phone)`,
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
      notes: row.notes as string | null,
      createdAt: row.created_at as string,
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

// ─── Update Booking Status

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "completed" | "cancelled",
): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

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
