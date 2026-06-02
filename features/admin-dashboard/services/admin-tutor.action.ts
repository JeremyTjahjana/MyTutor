"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient, supabase } from "@/lib/supabase/server";
import type {
  AdminTutorListState,
  AdminTutorReviewMode,
  TutorAdminItem,
  TutorReviewDecision,
  TutorReviewMutationState,
} from "../types";

type TutorRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: TutorAdminItem["role"];
  tutor_status: TutorAdminItem["tutorStatus"];
  contract_pdf_name?: string | null;
  contract_pdf_url?: string | null;
  created_at: string;
};

type TutorProfileRow = {
  user_id: string;
  bio: string | null;
  experience: string | null;
  cost_per_hour: number | string | null;
};

const USER_SELECT_WITH_CONTRACTS =
  "id, full_name, email, phone, role, tutor_status, contract_pdf_name, contract_pdf_url, created_at";
const USER_SELECT_FALLBACK =
  "id, full_name, email, phone, role, tutor_status, created_at";

function isAdminTutorReviewMode(
  value: string,
): value is AdminTutorReviewMode {
  return value === "pendaftaran" || value === "list-tutors";
}

function isTutorReviewDecision(
  value: string,
): value is TutorReviewDecision {
  return value === "approve" || value === "reject" || value === "revoke";
}

async function requireAdmin() {
  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) return false;

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return !profileError && profile?.role === "admin";
}

async function fetchAdminUsers(
  statusFilter: [column: "role" | "tutor_status", value: string],
) {
  const withContractsResult = await supabase
    .from("users")
    .select(USER_SELECT_WITH_CONTRACTS)
    .eq(statusFilter[0], statusFilter[1])
    .order("created_at", { ascending: false });

  if (!withContractsResult.error) {
    return (withContractsResult.data ?? []) as TutorRow[];
  }

  if (withContractsResult.error.code !== "42703") {
    throw withContractsResult.error;
  }

  const fallbackResult = await supabase
    .from("users")
    .select(USER_SELECT_FALLBACK)
    .eq(statusFilter[0], statusFilter[1])
    .order("created_at", { ascending: false });

  if (fallbackResult.error) {
    throw fallbackResult.error;
  }

  return (fallbackResult.data ?? []) as TutorRow[];
}

async function buildTutorItems(rows: TutorRow[]): Promise<TutorAdminItem[]> {
  const userIds = rows.map((row) => row.id);
  const { data: profilesData, error: profilesError } = userIds.length
    ? await supabase
        .from("tutor_profiles")
        .select("user_id, bio, experience, cost_per_hour")
        .in("user_id", userIds)
    : { data: [], error: null };

  if (profilesError) throw profilesError;

  const profileMap = new Map<string, TutorProfileRow>();
  (profilesData ?? []).forEach((row) => {
    profileMap.set(row.user_id, row);
  });

  return rows.map((row) => {
    const profile = profileMap.get(row.id);

    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      tutorStatus: row.tutor_status,
      contractPdfName: row.contract_pdf_name ?? null,
      contractPdfUrl: row.contract_pdf_url ?? null,
      createdAt: row.created_at,
      bio: profile?.bio ?? "",
      experience: profile?.experience ?? "",
      costPerHour: Number(profile?.cost_per_hour ?? 0),
    };
  });
}

export async function listAdminTutorsAction(
  mode: AdminTutorReviewMode,
): Promise<AdminTutorListState> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  if (!isAdminTutorReviewMode(mode)) {
    return { success: false, error: "Mode review tidak valid." };
  }

  try {
    const rows =
      mode === "pendaftaran"
        ? await fetchAdminUsers(["tutor_status", "pending"])
        : await fetchAdminUsers(["role", "tutor"]);

    return { success: true, data: await buildTutorItems(rows) };
  } catch (error) {
    console.error("listAdminTutorsAction error:", error);
    return { success: false, error: "Gagal memuat data tutor." };
  }
}

export async function reviewTutorAction(
  tutorId: string,
  decision: TutorReviewDecision,
): Promise<TutorReviewMutationState> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  if (!isTutorReviewDecision(decision)) {
    return { success: false, error: "Aksi review tidak valid." };
  }

  const cleanTutorId = tutorId.trim();
  if (!cleanTutorId) {
    return { success: false, error: "Tutor tidak ditemukan." };
  }

  const updates = {
    approve: { role: "tutor", tutor_status: "approved" },
    reject: { role: "student", tutor_status: "rejected" },
    revoke: { role: "student", tutor_status: null },
  } as const;

  try {
    let query = supabase
      .from("users")
      .update(updates[decision])
      .eq("id", cleanTutorId);

    query =
      decision === "revoke"
        ? query.eq("role", "tutor")
        : query.eq("tutor_status", "pending");

    const { data, error } = await query.select("id").maybeSingle();

    if (error) throw error;
    if (!data) {
      return {
        success: false,
        error: "Status tutor sudah berubah. Muat ulang daftar dan coba lagi.",
      };
    }

    revalidatePath("/admin-dashboard/pendaftaran");
    revalidatePath("/admin-dashboard/list-tutors");
    revalidatePath("/tutors");

    return { success: true };
  } catch (error) {
    console.error("reviewTutorAction error:", error);
    return { success: false, error: "Gagal memperbarui status tutor." };
  }
}
