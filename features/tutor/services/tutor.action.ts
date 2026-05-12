"use server";

import { supabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getTutorProfileByUserId,
  getSchedulesByTutorProfileId,
} from "@/features/tutor/services/tutor.service";
import { listTutorBookings } from "@/features/booking/services/booking.service";
import {
  linkTutorSubject,
  unlinkTutorSubject,
  resolveOrCreateSubjectIdByName,
} from "@/features/tutor/repositories/tutor.repository";

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

const AVATAR_BUCKET = "avatars";

export type UploadAvatarState = {
  success: boolean;
  error?: string;
};

/**
 * Uploads a profile image to Supabase Storage and sets `users.avatar_url`.
 * Requires a **public** storage bucket named `avatars` (Supabase → Storage).
 */
export async function uploadTutorAvatarAction(
  _prev: UploadAvatarState,
  formData: FormData,
): Promise<UploadAvatarState> {
  const userId = (formData.get("userId") as string | null)?.trim();
  const file = formData.get("avatar");

  if (!userId) {
    return { success: false, error: "Not signed in." };
  }
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image file first." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: "Image must be 2 MB or smaller." };
  }
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return { success: false, error: "Use a JPEG, PNG, or WebP image." };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const objectPath = `${userId}/avatar.${ext}`;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("uploadTutorAvatarAction storage:", uploadError);
      const hint =
        uploadError.message?.toLowerCase().includes("bucket") ||
        uploadError.message?.toLowerCase().includes("not found")
          ? ` Create a public bucket named "${AVATAR_BUCKET}" in Supabase (Storage), then try again.`
          : "";
      return {
        success: false,
        error: (uploadError.message ?? "Upload failed.") + hint,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(objectPath);

    const cacheBusted = `${publicUrl}?v=${Date.now()}`;

    const { error: dbError } = await supabase
      .from("users")
      .update({ avatar_url: cacheBusted })
      .eq("id", userId);

    if (dbError) throw dbError;

    revalidatePath("/tutor-dashboard/profile");
    revalidatePath("/tutor-dashboard");
    return { success: true };
  } catch (err) {
    console.error("uploadTutorAvatarAction error:", err);
    return { success: false, error: "Could not save your photo. Try again." };
  }
}

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

// ─── Tutor subjects (mata kuliah / skills) ───────────────────────────────────

export type TutorSubjectMutationResult = {
  success: boolean;
  error?: string;
};

function revalidateTutorSubjectPaths() {
  revalidatePath("/tutor-dashboard/subjects");
  revalidatePath("/tutor-dashboard");
  revalidatePath("/tutors");
}

export async function addTutorSubjectBySubjectIdAction(
  tutorUserId: string,
  subjectId: string,
): Promise<TutorSubjectMutationResult> {
  if (!tutorUserId?.trim() || !subjectId?.trim()) {
    return { success: false, error: "Data tidak lengkap." };
  }
  try {
    const profile = await getTutorProfileByUserId(tutorUserId);
    if (!profile?.id) {
      return { success: false, error: "Profil tutor tidak ditemukan." };
    }
    const linked = await linkTutorSubject(profile.id as string, subjectId);
    if (!linked.ok) {
      if (linked.code === "duplicate") {
        return { success: false, error: linked.message };
      }
      return { success: false, error: linked.message };
    }
    revalidateTutorSubjectPaths();
    return { success: true };
  } catch (err) {
    console.error("addTutorSubjectBySubjectIdAction:", err);
    return { success: false, error: "Gagal menambahkan mata kuliah." };
  }
}

export async function addTutorSubjectByCustomNameAction(
  tutorUserId: string,
  rawName: string,
  rawCategory?: string | null,
): Promise<TutorSubjectMutationResult> {
  if (!tutorUserId?.trim()) {
    return { success: false, error: "Belum masuk." };
  }
  const subjectId = await resolveOrCreateSubjectIdByName(rawName, rawCategory);
  if (!subjectId) {
    return { success: false, error: "Nama tidak valid atau gagal menyimpan." };
  }
  return addTutorSubjectBySubjectIdAction(tutorUserId, subjectId);
}

export async function removeTutorSubjectAction(
  tutorUserId: string,
  subjectId: string,
): Promise<TutorSubjectMutationResult> {
  if (!tutorUserId?.trim() || !subjectId?.trim()) {
    return { success: false, error: "Data tidak lengkap." };
  }
  try {
    const profile = await getTutorProfileByUserId(tutorUserId);
    if (!profile?.id) {
      return { success: false, error: "Profil tutor tidak ditemukan." };
    }
    await unlinkTutorSubject(profile.id as string, subjectId);
    revalidateTutorSubjectPaths();
    return { success: true };
  } catch (err) {
    console.error("removeTutorSubjectAction:", err);
    return { success: false, error: "Gagal menghapus mata kuliah." };
  }
}
