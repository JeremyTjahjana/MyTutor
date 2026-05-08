import { NextRequest, NextResponse } from "next/server";
import { listStudentBookings } from "@/app/server/services/bookings.service";
import { fetchTutorProfileByUserId } from "@/app/server/repositories/tutors.repository";
import { listTutorBookings } from "@/app/server/services/bookings.service";
import { supabase } from "@/app/server/supabase";

/**
 * Cancel pending bookings that conflict with an already-accepted booking
 * for the same tutor slot. Runs before returning the student's booking list
 * so the UI always reflects the latest state.
 */
async function cancelConflictingPendingBookings(studentId: string) {
  // Fetch all pending bookings for this student
  const { data: pending } = await supabase
    .from("bookings")
    .select("id, tutor_profile_id, schedule_id, start_time")
    .eq("student_id", studentId)
    .eq("status", "pending");

  if (!pending?.length) return;

  const toCancel: string[] = [];

  for (const b of pending) {
    // Check if another booking (any student) for the same slot is accepted
    let query = supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("tutor_profile_id", b.tutor_profile_id)
      .eq("status", "accepted")
      .neq("id", b.id);

    if (b.schedule_id) {
      query = query.eq("schedule_id", b.schedule_id);
    } else {
      // Fallback: match by exact start_time
      query = query.eq("start_time", b.start_time);
    }

    const { count } = await query;
    if (count && count > 0) toCancel.push(b.id);
  }

  if (toCancel.length > 0) {
    await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .in("id", toCancel);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const tutorUserId = searchParams.get("tutorUserId");

  try {
    if (studentId) {
      // Auto-cancel conflicting pending bookings before returning the list
      await cancelConflictingPendingBookings(studentId);
      const bookings = await listStudentBookings(studentId);
      return NextResponse.json(bookings);
    }

    if (tutorUserId) {
      const profile = await fetchTutorProfileByUserId(tutorUserId);
      if (!profile) return NextResponse.json([]);
      const bookings = await listTutorBookings(profile.id);
      return NextResponse.json(bookings);
    }

    return NextResponse.json(
      { error: "studentId or tutorUserId required" },
      { status: 400 },
    );
  } catch (err) {
    console.error("/api/bookings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
