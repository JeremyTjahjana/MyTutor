import {
  fetchBookingsByStudentId,
  fetchBookingsByTutorProfileId,
  insertBooking,
  insertTestimony,
  updateBookingStatus,
  type CreateBookingInput,
  type CreateTestimonyInput,
} from "../repositories/booking.repository";
import type { Booking } from "@/types/user";

export async function listStudentBookings(
  studentId: string,
): Promise<Booking[]> {
  return fetchBookingsByStudentId(studentId);
}

export async function listTutorBookings(
  tutorProfileId: string,
): Promise<Booking[]> {
  return fetchBookingsByTutorProfileId(tutorProfileId);
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

export async function completeBooking(bookingId: string): Promise<void> {
  return updateBookingStatus(bookingId, "completed");
}

export async function cancelBooking(bookingId: string): Promise<void> {
  return updateBookingStatus(bookingId, "cancelled");
}
