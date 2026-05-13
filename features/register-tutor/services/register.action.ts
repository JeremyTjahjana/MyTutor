"use server";

import { supabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { DAY_NUMBERS } from "@/types/tutor";

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
  contractFileName: string;
  contractPdfUrl: string;
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
        tutor_status: "pending",
        role: "student",
        contract_pdf_name: input.contractFileName,
        contract_pdf_url: input.contractPdfUrl,
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
      options: { data: { full_name: input.namaLengkap, role: "student" } },
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
      role: "student",
      tutor_status: "pending",
      contract_pdf_name: input.contractFileName,
      contract_pdf_url: input.contractPdfUrl,
    });
  }

  // 3. Upsert tutor_profiles row (handles re-registration after revoke)
  const { data: profileData, error: profileError } = await supabase
    .from("tutor_profiles")
    .upsert(
      {
        user_id: userId,
        experience: input.lamaExperience,
        cost_per_hour: Number(input.biayaPerJam) || 0,
      },
      { onConflict: "user_id" },
    )
    .select("id")
    .single();

  if (profileError || !profileData) {
    console.error("registerTutor: tutor_profiles upsert error", profileError);
    return {
      success: false,
      error: `Gagal membuat profil tutor: ${profileError?.message ?? "unknown"}`,
    };
  }

  const tutorProfileId = profileData.id;

  // Clear old tutor_subjects and schedules (in case of re-registration)
  await supabase
    .from("tutor_subjects")
    .delete()
    .eq("tutor_profile_id", tutorProfileId);
  await supabase
    .from("schedules")
    .delete()
    .eq("tutor_profile_id", tutorProfileId);

  // 4. Resolve subjects by name (ignore category — registration doesn't know categories)
  const subjectLinks: { tutor_profile_id: string; subject_id: string }[] = [];
  for (const matkulName of input.matkuls) {
    const trimmed = matkulName.trim();
    if (!trimmed) continue;

    // First try to find an existing subject by name (case-insensitive)
    const { data: existing } = await supabase
      .from("subjects")
      .select("id")
      .ilike("name", trimmed)
      .limit(1)
      .single();

    let subjectId: string | null = existing?.id ?? null;

    // If not found, create a new one
    if (!subjectId) {
      const { data: created, error: createErr } = await supabase
        .from("subjects")
        .insert({ name: trimmed, category: null })
        .select("id")
        .single();

      if (createErr) {
        // Handle race condition — try finding again
        if (createErr.code === "23505") {
          const { data: retry } = await supabase
            .from("subjects")
            .select("id")
            .ilike("name", trimmed)
            .limit(1)
            .single();
          subjectId = retry?.id ?? null;
        } else {
          console.error("registerTutor: subject create error for", trimmed, createErr);
        }
      } else {
        subjectId = created.id;
      }
    }

    if (subjectId) {
      subjectLinks.push({
        tutor_profile_id: tutorProfileId,
        subject_id: subjectId,
      });
    } else {
      console.warn("registerTutor: could not resolve subject:", trimmed);
    }
  }

  if (subjectLinks.length > 0) {
    const { error: linkErr } = await supabase
      .from("tutor_subjects")
      .insert(subjectLinks);
    if (linkErr) {
      console.error("registerTutor: tutor_subjects batch insert error", linkErr);
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
