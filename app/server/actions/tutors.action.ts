"use server";

import { supabase } from "@/app/server/supabase";
import { revalidatePath } from "next/cache";
import {
  getTutorProfileByUserId,
  getSchedulesByTutorProfileId,
} from "@/app/server/services/tutors.service";
import { listTutorBookings } from "@/app/server/services/bookings.service";

// ─── Get Dashboard Data ───────────────────────────────────────────────────────

export async function getDashboardDataAction(userId: string) {
  try {
    // Get tutor profile
    const profile = await getTutorProfileByUserId(userId);
    if (!profile) {
      return { success: false, error: "Profil tutor tidak ditemukan." };
    }

    // Get schedules
    const schedules = await getSchedulesByTutorProfileId(profile.id);

    // Get bookings
    const bookings = await listTutorBookings(profile.id);

    return {
      success: true,
      data: {
        profile,
        schedules,
        bookings,
      },
    };
  } catch (err) {
    console.error("getDashboardDataAction error:", err);
    return { success: false, error: "Gagal mengambil data dashboard." };
  }
}

// ─── Update Tutor Profile ─────────────────────────────────────────────────────

export type UpdateProfileState = {
  success: boolean;
  error?: string;
};

export async function updateTutorProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const userId = formData.get("userId") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const experience = formData.get("experience") as string;
  const costPerHour = Number(formData.get("costPerHour"));

  if (!userId) return { success: false, error: "User tidak ditemukan." };

  try {
    // Update users table
    const { error: userError } = await supabase
      .from("users")
      .update({ full_name: fullName, phone })
      .eq("id", userId);

    if (userError) throw userError;

    // Update tutor_profiles table
    const { error: profileError } = await supabase
      .from("tutor_profiles")
      .update({ bio, experience, cost_per_hour: costPerHour })
      .eq("user_id", userId);

    if (profileError) throw profileError;

    revalidatePath("/tutor-dashboard/profile");
    revalidatePath("/tutor-dashboard");
    return { success: true };
  } catch (err) {
    console.error("updateTutorProfileAction error:", err);
    return { success: false, error: "Gagal memperbarui profil." };
  }
}

// ─── Update Tutor Schedules ───────────────────────────────────────────────────

export type ScheduleSlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type UpdateScheduleState = {
  success: boolean;
  error?: string;
};

export async function updateTutorScheduleAction(
  tutorProfileId: string,
  slots: ScheduleSlot[],
): Promise<UpdateScheduleState> {
  try {
    // Delete existing schedules for this tutor
    const { error: deleteError } = await supabase
      .from("schedules")
      .delete()
      .eq("tutor_profile_id", tutorProfileId);

    if (deleteError) throw deleteError;

    // Insert new schedules
    if (slots.length > 0) {
      const { error: insertError } = await supabase.from("schedules").insert(
        slots.map((slot) => ({
          tutor_profile_id: tutorProfileId,
          day_of_week: slot.dayOfWeek,
          start_time: slot.startTime,
          end_time: slot.endTime,
          is_available: true,
        })),
      );
      if (insertError) throw insertError;
    }

    revalidatePath("/tutor-dashboard/schedule");
    revalidatePath("/tutor-dashboard");
    return { success: true };
  } catch (err) {
    console.error("updateTutorScheduleAction error:", err);
    return { success: false, error: "Gagal menyimpan jadwal." };
  }
}
