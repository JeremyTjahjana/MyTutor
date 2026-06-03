"use server";

import { createSupabaseServerClient, supabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getTutorProfileByUserId,
  getSchedulesByTutorProfileId,
} from "@/features/tutor/services/tutor.service";
import {
  getTutorProfileStats,
  listTutorBookings,
} from "@/features/booking/services/booking.service";
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
    const stats = await getTutorProfileStats(
      profile.id,
      Number(profile.cost_per_hour ?? 0),
    );

    return {
      success: true,
      data: {
        profile: {
          ...profile,
          total_sessions: stats.totalSessions,
          total_earnings: stats.totalEarnings,
        },
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
  portfolioUrls?: string[];
};

const AVATAR_BUCKET = "avatars";
const PORTFOLIO_BUCKET = "tutor-portfolios";
const PORTFOLIO_MAX_BYTES = 5 * 1024 * 1024;
const PORTFOLIO_MAX_IMAGES = 6;
const PORTFOLIO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadAvatarState = {
  success: boolean;
  error?: string;
};

async function requireMatchingUser(userId: string) {
  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user || user.id !== userId) {
    return null;
  }

  return user;
}

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
  const authUser = await requireMatchingUser(userId);
  if (!authUser) {
    return { success: false, error: "Unauthorized." };
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
    let { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        upsert: true,
      });

    const bucketMayBeMissing =
      uploadError?.message?.toLowerCase().includes("bucket") ||
      uploadError?.message?.toLowerCase().includes("not found");

    if (bucketMayBeMissing) {
      const { error: bucketError } = await supabase.storage.createBucket(
        AVATAR_BUCKET,
        {
          public: true,
          allowedMimeTypes: allowed,
          fileSizeLimit: 2 * 1024 * 1024,
        },
      );

      if (
        bucketError &&
        !bucketError.message?.toLowerCase().includes("already exists")
      ) {
        console.error("uploadTutorAvatarAction create bucket:", bucketError);
      } else {
        const retry = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(objectPath, bytes, {
            contentType: file.type,
            upsert: true,
          });
        uploadError = retry.error;
      }
    }

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
    revalidatePath("/tutors");
    return { success: true };
  } catch (err) {
    console.error("uploadTutorAvatarAction error:", err);
    return { success: false, error: "Could not save your photo. Try again." };
  }
}

async function updateTutorAvatar(userId: string, file: File): Promise<void> {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be 2 MB or smaller.");
  }
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const objectPath = `${userId}/avatar.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  let { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(objectPath, bytes, {
      contentType: file.type,
      upsert: true,
    });

  const bucketMayBeMissing =
    uploadError?.message?.toLowerCase().includes("bucket") ||
    uploadError?.message?.toLowerCase().includes("not found");

  if (bucketMayBeMissing) {
    const { error: bucketError } = await supabase.storage.createBucket(
      AVATAR_BUCKET,
      {
        public: true,
        allowedMimeTypes: allowed,
        fileSizeLimit: 2 * 1024 * 1024,
      },
    );

    if (
      bucketError &&
      !bucketError.message?.toLowerCase().includes("already exists")
    ) {
      throw bucketError;
    }

    const retry = await supabase.storage.from(AVATAR_BUCKET).upload(
      objectPath,
      bytes,
      {
        contentType: file.type,
        upsert: true,
      },
    );
    uploadError = retry.error;
  }

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(objectPath);

  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_url: `${publicUrl}?v=${Date.now()}` })
    .eq("id", userId);

  if (dbError) throw dbError;
}

function parseCurrentPortfolioUrls(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

async function ensurePortfolioImageBucket(): Promise<void> {
  const config = {
    public: true,
    allowedMimeTypes: PORTFOLIO_ALLOWED_TYPES,
    fileSizeLimit: PORTFOLIO_MAX_BYTES,
  };

  const { error: updateError } = await supabase.storage.updateBucket(
    PORTFOLIO_BUCKET,
    config,
  );

  if (!updateError) return;

  const bucketMayBeMissing =
    updateError.message?.toLowerCase().includes("bucket") ||
    updateError.message?.toLowerCase().includes("not found");

  if (!bucketMayBeMissing) throw updateError;

  const { error: createError } = await supabase.storage.createBucket(
    PORTFOLIO_BUCKET,
    config,
  );

  if (
    createError &&
    !createError.message?.toLowerCase().includes("already exists")
  ) {
    throw createError;
  }
}

async function uploadTutorPortfolioImages(
  userId: string,
  files: File[],
): Promise<string[]> {
  const validFiles = files.filter((file) => file.size > 0);

  if (validFiles.length === 0) return [];
  if (validFiles.length > PORTFOLIO_MAX_IMAGES) {
    throw new Error(
      `Portfolio maksimal ${PORTFOLIO_MAX_IMAGES} gambar. Pilih gambar terbaik agar halaman tetap ringan.`,
    );
  }

  const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > PORTFOLIO_MAX_BYTES) {
    throw new Error(
      "Total ukuran gambar portfolio maksimal 5 MB. Coba kompres gambar atau pilih lebih sedikit gambar.",
    );
  }

  const invalidFile = validFiles.find(
    (file) => !PORTFOLIO_ALLOWED_TYPES.includes(file.type),
  );
  if (invalidFile) {
    throw new Error("Portfolio hanya menerima gambar JPG, PNG, atau WebP.");
  }

  const urls: string[] = [];
  await ensurePortfolioImageBucket();

  for (const [index, file] of validFiles.entries()) {
    const uniqueId = `${Date.now()}-${index + 1}`;
    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";
    const objectPath = `${userId}/portfolio-${uniqueId}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(objectPath);

    urls.push(`${publicUrl}?v=${Date.now()}`);
  }

  return urls;
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
  const avatar = formData.get("avatar");
  const portfolioImages = formData
    .getAll("portfolioImages")
    .filter((file): file is File => file instanceof File);
  const currentPortfolioUrls = parseCurrentPortfolioUrls(
    formData.get("currentPortfolioUrls"),
  );

  if (!userId) return { success: false, error: "User tidak ditemukan." };
  const authUser = await requireMatchingUser(userId);
  if (!authUser) return { success: false, error: "Unauthorized." };

  const cleanFullName = fullName?.trim();
  if (!cleanFullName) {
    return { success: false, error: "Nama lengkap wajib diisi." };
  }

  const cleanCostPerHour = Number.isFinite(costPerHour)
    ? Math.max(0, costPerHour)
    : 0;

  try {
    let portfolioUrls = currentPortfolioUrls;
    if (portfolioImages.some((file) => file.size > 0)) {
      const newImageCount = portfolioImages.filter((file) => file.size > 0).length;
      if (currentPortfolioUrls.length + newImageCount > PORTFOLIO_MAX_IMAGES) {
        throw new Error(
          `Portfolio maksimal ${PORTFOLIO_MAX_IMAGES} gambar. Hapus atau kurangi pilihan gambar terlebih dahulu.`,
        );
      }

      const newPortfolioUrls = await uploadTutorPortfolioImages(
        userId,
        portfolioImages,
      );
      portfolioUrls = [...currentPortfolioUrls, ...newPortfolioUrls];
    }

    // Update users table
    const { error: userError } = await supabase
      .from("users")
      .update({ full_name: cleanFullName, phone: phone?.trim() || null })
      .eq("id", userId);

    if (userError) throw userError;

    // Update tutor_profiles table
    const { data: updatedProfile, error: profileError } = await supabase
      .from("tutor_profiles")
      .update({
        bio: bio?.trim() || "",
        experience: experience?.trim() || "",
        cost_per_hour: cleanCostPerHour,
        portfolio_urls: portfolioUrls,
      })
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (profileError) throw profileError;
    if (!updatedProfile) {
      return { success: false, error: "Profil tutor tidak ditemukan." };
    }

    if (avatar instanceof File && avatar.size > 0) {
      await updateTutorAvatar(userId, avatar);
    }

    revalidatePath("/tutor-dashboard/profile");
    revalidatePath("/tutor-dashboard");
    revalidatePath("/tutors");
    revalidatePath(`/tutors/${updatedProfile.id}`);
    return { success: true, portfolioUrls };
  } catch (err) {
    console.error("updateTutorProfileAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal memperbarui profil.",
    };
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
