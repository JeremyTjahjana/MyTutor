"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  FileText,
  Loader2,
  UserCheck,
  UserMinus,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

type TutorRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  tutor_status: string | null;
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

type TutorAdminItem = TutorRow & {
  bio: string;
  experience: string;
  costPerHour: number;
};

type AdminMode = "pendaftaran" | "list-tutors";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const USER_SELECT_WITH_CONTRACTS =
  "id, full_name, email, phone, role, tutor_status, contract_pdf_name, contract_pdf_url, created_at";
const USER_SELECT_FALLBACK =
  "id, full_name, email, phone, role, tutor_status, created_at";

async function fetchAdminUsers(statusFilter: [column: string, value: string]) {
  const withContractsResult = await supabase
    .from("users")
    .select(USER_SELECT_WITH_CONTRACTS)
    .eq(statusFilter[0], statusFilter[1])
    .order("created_at", { ascending: false });

  if (!withContractsResult.error) {
    return withContractsResult.data ?? [];
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

  return fallbackResult.data ?? [];
}

const modeConfig: Record<
  AdminMode,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  pendaftaran: {
    title: "Pendaftaran",
    description:
      "Review pengajuan tutor yang masih pending dan lihat file kontraknya.",
    emptyTitle: "Tidak ada pendaftaran tutor",
    emptyDescription:
      "Pengajuan tutor baru akan muncul di sini setelah mereka mengirim form registrasi.",
  },
  "list-tutors": {
    title: "List tutors",
    description: "Lihat tutor aktif dan revoke role tutor bila perlu.",
    emptyTitle: "Tidak ada tutor aktif",
    emptyDescription:
      "Tutor yang sudah di-approve akan muncul di sini bersama akses revoke.",
  },
};

export default function AdminTutorReview({ mode }: { mode: AdminMode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<TutorAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildItems = async (rows: TutorRow[]) => {
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
        ...row,
        bio: profile?.bio ?? "",
        experience: profile?.experience ?? "",
        costPerHour: Number(profile?.cost_per_hour ?? 0),
      };
    });
  };

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const rows =
        mode === "pendaftaran"
          ? await fetchAdminUsers(["tutor_status", "pending"])
          : await fetchAdminUsers(["role", "tutor"]);

      setItems(await buildItems(rows));
    } catch (err) {
      console.error("loadAdminData error:", err);
      setError("Gagal memuat data tutor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      void loadAdminData();
    }
  }, [mode, user?.role]);

  const approveTutor = async (tutorId: string) => {
    setSubmittingId(tutorId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "tutor", tutor_status: "approved" })
        .eq("id", tutorId);

      if (updateError) throw updateError;

      await loadAdminData();
    } catch (err) {
      console.error("approveTutor error:", err);
      setError("Gagal meng-approve tutor.");
    } finally {
      setSubmittingId(null);
    }
  };

  const revokeTutor = async (tutorId: string) => {
    setSubmittingId(tutorId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "student", tutor_status: null })
        .eq("id", tutorId);

      if (updateError) throw updateError;

      await loadAdminData();
    } catch (err) {
      console.error("revokeTutor error:", err);
      setError("Gagal merevoke tutor.");
    } finally {
      setSubmittingId(null);
    }
  };

  const config = modeConfig[mode];

  const getPdfLink = (item: TutorAdminItem) =>
    item.contract_pdf_url ? (
      <a
        href={item.contract_pdf_url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--gelap)]/10 px-3 py-2 text-sm font-medium text-[var(--biru)] hover:bg-[var(--biru)]/5"
      >
        <FileText className="h-4 w-4" />
        {item.contract_pdf_name ?? "Lihat PDF"}
      </a>
    ) : (
      <span className="text-sm text-[var(--gelap)]/45">Belum ada PDF</span>
    );

  const activeItems = useMemo(() => items, [items]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--biru)]/10 px-3 py-1 text-xs font-semibold text-[var(--biru)]">
            <UserCheck className="h-3.5 w-3.5" />
            Admin review
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--gelap)] sm:text-3xl">
                {config.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--gelap)]/60 sm:text-base">
                {config.description}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--gelap)]/10 bg-[var(--putih)] px-4 py-3 text-sm text-[var(--gelap)]/65">
              Total:{" "}
              <span className="font-semibold text-[var(--gelap)]">
                {activeItems.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <p className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-[var(--gelap)]/10 bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--biru)]" />
            </div>
          ) : activeItems.length === 0 ? (
            <div className="rounded-3xl border border-[var(--gelap)]/10 bg-[var(--putih)] p-8 text-center shadow-sm">
              <UserCheck className="mx-auto h-12 w-12 text-[var(--biru)]/35" />
              <h2 className="mt-4 text-lg font-semibold text-[var(--gelap)]">
                {config.emptyTitle}
              </h2>
              <p className="mt-2 text-sm text-[var(--gelap)]/55">
                {config.emptyDescription}
              </p>
            </div>
          ) : (
            activeItems.map((tutor) => (
              <article
                key={tutor.id}
                className="rounded-3xl border border-[var(--gelap)]/10 bg-[var(--putih)] p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[var(--gelap)]">
                        {tutor.full_name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tutor.tutor_status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {tutor.tutor_status === "approved"
                          ? "Approved"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm text-[var(--gelap)]/70 sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-[var(--gelap)]">
                          Email:
                        </span>{" "}
                        {tutor.email}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--gelap)]">
                          Phone:
                        </span>{" "}
                        {tutor.phone ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--gelap)]">
                          Experience:
                        </span>{" "}
                        {tutor.experience || "-"}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--gelap)]">
                          Rate:
                        </span>{" "}
                        {formatCurrency(tutor.costPerHour)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {getPdfLink(tutor)}
                    </div>

                    {tutor.bio && (
                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--gelap)]/70">
                        <p className="mb-1 font-medium text-[var(--gelap)]">
                          Bio
                        </p>
                        <p>{tutor.bio}</p>
                      </div>
                    )}

                    <p className="text-xs text-[var(--gelap)]/45">
                      Submitted on{" "}
                      {new Date(tutor.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 lg:flex-col lg:items-stretch">
                    {mode === "pendaftaran" ? (
                      <button
                        type="button"
                        onClick={() => approveTutor(tutor.id)}
                        disabled={submittingId === tutor.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--biru)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submittingId === tutor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BadgeCheck className="h-4 w-4" />
                        )}
                        Approve tutor
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => revokeTutor(tutor.id)}
                        disabled={submittingId === tutor.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submittingId === tutor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserMinus className="h-4 w-4" />
                        )}
                        Revoke tutor
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
