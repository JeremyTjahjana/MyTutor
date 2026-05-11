"use server";

import { supabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { DAY_NUMBERS } from "@/types/tutor";
import { resolveOrCreateSubjectIdByName } from "@/features/tutor/repositories/tutor.repository";

/** The client-facing anon key client — used here to call auth.signUp */
const authClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export type RegisterState = {
  success: boolean;
  error?: string;
};

export type RegisterInput = {
  // Step 1 — only required when registering a NEW user (not already logged in)
  namaLengkap?: string;
  emailIPB?: string;
  password?: string;
  nomorTelepon?: string;
  /** If the user is already logged in, pass their ID to skip auth.signUp */
  existingUserId?: string;
  // Step 3
  lamaExperience: string;
  biayaPerJam: string;
  // Step 4
  matkuls: string[]; // subject names
  waktuTersedia: { day: string; start: string; end: string }[];
};

export async function registerTutorAction(
  input: RegisterInput,
): Promise<RegisterState> {
  let userId: string;

  if (input.existingUserId) {
    // ── Already logged-in user upgrading to tutor ──────────────────────
    userId = input.existingUserId;

    const { error: updateError } = await supabase
      .from("users")
      .update({
        role: "tutor",
        tutor_status: "pending",
        ...(input.nomorTelepon ? { phone: input.nomorTelepon } : {}),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("registerTutor: user update error", updateError);
      return { success: false, error: "Gagal mengubah role akun." };
    }
  } else {
    // ── New user signup + tutor registration ───────────────────────────
    if (!input.emailIPB || !input.password || !input.namaLengkap) {
      return { success: false, error: "Data akun tidak lengkap." };
    }

    const { data: authData, error: authError } = await authClient.auth.signUp({
      email: input.emailIPB,
      password: input.password,
      options: { data: { full_name: input.namaLengkap, role: "tutor" } },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message ?? "Gagal membuat akun.",
      };
    }

    userId = authData.user.id;

    await supabase.from("users").upsert({
      id: userId,
      full_name: input.namaLengkap,
      email: input.emailIPB,
      phone: input.nomorTelepon ?? null,
      role: "tutor",
      tutor_status: "pending",
    });
  }

  // 3. Create tutor_profiles row
  const { data: profileData, error: profileError } = await supabase
    .from("tutor_profiles")
    .insert({
      user_id: userId,
      experience: input.lamaExperience,
      cost_per_hour: Number(input.biayaPerJam) || 0,
    })
    .select("id")
    .single();

  if (profileError || !profileData) {
    console.error("registerTutor: tutor_profiles insert error", profileError);
    return {
      success: false,
      error: `Gagal membuat profil tutor: ${profileError?.message ?? "unknown"}`,
    };
  }

  const tutorProfileId = profileData.id;

  // 4. Resolve subjects — by (name, category); category null for legacy matkul list
  for (const matkulName of input.matkuls) {
    const subjectId = await resolveOrCreateSubjectIdByName(matkulName, null);
    if (!subjectId) continue;

    const { error: linkErr } = await supabase.from("tutor_subjects").insert({
      tutor_profile_id: tutorProfileId,
      subject_id: subjectId,
    });
    if (linkErr) {
      console.error("registerTutor: tutor_subjects insert", linkErr);
    }
  }

  // 5. Create schedules
  if (input.waktuTersedia.length > 0) {
    const scheduleRows = input.waktuTersedia.map((slot) => ({
      tutor_profile_id: tutorProfileId,
      day_of_week: DAY_NUMBERS[slot.day] ?? 1,
      start_time: slot.start,
      end_time: slot.end,
      is_available: true,
    }));

    const { error: schedError } = await supabase
      .from("schedules")
      .insert(scheduleRows);

    if (schedError) {
      console.error("registerTutor: schedule insert error", schedError);
    }
  }

  return { success: true };
}
