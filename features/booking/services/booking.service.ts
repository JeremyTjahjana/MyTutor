import {
  cancelConflictingPendingBookingsForStudent,
  fetchBookingsByStudentId,
  fetchBookingsByTutorProfileId,
  insertBooking,
  insertTestimony,
  updateBookingStatus,
  confirmBookingCompletion,
  calculateTutorProfileStats,
  BookingRuleError,
  type CreateBookingInput,
  type CreateTestimonyInput,
} from "../repositories/booking.repository";
import { fetchTutorProfileByUserId } from "@/features/tutor/repositories/tutor.repository";
import type { Booking } from "@/types/user";

export { BookingRuleError };

export async function listStudentBookings(
  studentId: string,
): Promise<Booking[]> {
  return fetchBookingsByStudentId(studentId);
}

export async function listStudentBookingsWithConflictSync(
  studentId: string,
): Promise<Booking[]> {
  await cancelConflictingPendingBookingsForStudent(studentId);
  return listStudentBookings(studentId);
}

export async function listTutorBookings(
  tutorProfileId: string,
): Promise<Booking[]> {
  return fetchBookingsByTutorProfileId(tutorProfileId);
}

export async function listBookingsForDashboardRequest({
  studentId,
  tutorUserId,
}: {
  studentId?: string | null;
  tutorUserId?: string | null;
}): Promise<Booking[]> {
  if (studentId) {
    return listStudentBookingsWithConflictSync(studentId);
  }

  if (tutorUserId) {
    const profile = await fetchTutorProfileByUserId(tutorUserId);
    if (!profile) return [];
    return listTutorBookings(profile.id);
  }

  throw new Error("BOOKING_FILTER_REQUIRED");
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<{ id: string }> {
  return insertBooking(input);
}

export async function createTestimony(input: CreateTestimonyInput): Promise<void> {
  return insertTestimony(input);
}

export async function acceptBooking(bookingId: string): Promise<void> {
  return updateBookingStatus(bookingId, "accepted");
}

export async function rejectBooking(bookingId: string): Promise<void> {
  return updateBookingStatus(bookingId, "cancelled");
}

export async function completeBooking(
  bookingId: string,
  actor: "student" | "tutor",
): Promise<void> {
  return confirmBookingCompletion(bookingId, actor);
}

export async function getTutorProfileStats(
  tutorProfileId: string,
  fallbackCostPerHour: number,
) {
  return calculateTutorProfileStats(tutorProfileId, fallbackCostPerHour);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  return updateBookingStatus(bookingId, "cancelled");
}
