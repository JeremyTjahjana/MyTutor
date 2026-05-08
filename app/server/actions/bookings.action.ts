"use server";

import { createBooking as createBookingService } from "@/app/server/services/bookings.service";
import {
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "@/app/server/services/bookings.service";
import { revalidatePath } from "next/cache";

export type CreateBookingState = {
  success: boolean;
  bookingId?: string;
  error?: string;
};

export async function createBookingAction(
  _prevState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const studentId = formData.get("studentId") as string;
  const tutorProfileId = formData.get("tutorProfileId") as string;
  const subjectId = formData.get("subjectId") as string;
  const scheduleId = formData.get("scheduleId") as string | undefined;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const notes = (formData.get("notes") as string) || undefined;

  if (!studentId || !tutorProfileId || !subjectId || !startTime || !endTime) {
    return { success: false, error: "Data pemesanan tidak lengkap." };
  }

  try {
    const { id } = await createBookingService({
      studentId,
      tutorProfileId,
      subjectId,
      scheduleId: scheduleId || undefined,
      startTime,
      endTime,
      notes,
    });
    revalidatePath("/bookinglist");
    return { success: true, bookingId: id };
  } catch (err) {
    console.error("createBookingAction error:", err);
    return {
      success: false,
      error: "Gagal membuat pemesanan. Silakan coba lagi.",
    };
  }
}

export async function acceptBookingAction(bookingId: string): Promise<void> {
  await acceptBooking(bookingId);
  revalidatePath("/tutor-dashboard/bookings");
}

export async function rejectBookingAction(bookingId: string): Promise<void> {
  await rejectBooking(bookingId);
  revalidatePath("/tutor-dashboard/bookings");
}

export async function completeBookingAction(bookingId: string): Promise<void> {
  await completeBooking(bookingId);
  revalidatePath("/tutor-dashboard/bookings");
}

export async function cancelBookingAction(bookingId: string): Promise<void> {
  await cancelBooking(bookingId);
  revalidatePath("/bookinglist");
}
