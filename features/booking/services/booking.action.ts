"use server";

import {
  createBooking as createBookingService,
  createTestimony,
} from "@/features/booking/services/booking.service";
import {
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "@/features/booking/services/booking.service";
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
  const studentCount = Math.max(1, Number(formData.get("studentCount")) || 1);
  const sessionCount = Math.max(1, Number(formData.get("sessionCount")) || 1);

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
      studentCount,
      sessionCount,
    });
    revalidatePath("/booking-list");
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

export async function completeBookingAction(
  bookingId: string,
  actor: "student" | "tutor" = "tutor",
): Promise<void> {
  await completeBooking(bookingId, actor);
  revalidatePath("/booking-list");
  revalidatePath("/tutor-dashboard/bookings");
}

export async function cancelBookingAction(bookingId: string): Promise<void> {
  await cancelBooking(bookingId);
  revalidatePath("/booking-list");
}

export type CreateTestimonyActionInput = {
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  rating: number;
  message?: string | null;
};

export type CreateTestimonyActionState = {
  success: boolean;
  error?: string;
};

export async function createTestimonyAction(
  input: CreateTestimonyActionInput,
): Promise<CreateTestimonyActionState> {
  if (
    !input.bookingId ||
    !input.studentId ||
    !input.tutorProfileId ||
    !Number.isFinite(input.rating)
  ) {
    return { success: false, error: "Data testimoni tidak lengkap." };
  }

  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: "Rating harus antara 1 sampai 5." };
  }

  try {
    await createTestimony({
      bookingId: input.bookingId,
      studentId: input.studentId,
      tutorProfileId: input.tutorProfileId,
      rating: input.rating,
      message: input.message?.trim() || null,
    });
    revalidatePath("/booking-list");
    return { success: true };
  } catch (err: unknown) {
    const maybeDbError = err as { code?: string };
    if (maybeDbError?.code === "23505") {
      return {
        success: false,
        error: "Testimoni untuk booking ini sudah pernah dikirim.",
      };
    }
    console.error("createTestimonyAction error:", err);
    return {
      success: false,
      error: "Gagal mengirim testimoni. Silakan coba lagi.",
    };
  }
}
