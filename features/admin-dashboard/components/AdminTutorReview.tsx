"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, UserCheck } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { adminTutorReviewModeConfig } from "../constants";
import {
  listAdminTutorsAction,
  reviewTutorAction,
} from "../services/admin-tutor.action";
import type {
  AdminTutorReviewMode,
  TutorAdminItem,
  TutorReviewDecision,
} from "../types";
import AdminTutorCard from "./AdminTutorCard";

export default function AdminTutorReview({
  mode,
}: {
  mode: AdminTutorReviewMode;
}) {
  const { user } = useAuth();
  const [items, setItems] = useState<TutorAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<{
    tutorId: string;
    decision: TutorReviewDecision;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await listAdminTutorsAction(mode);
    if (result.success) {
      setItems(result.data ?? []);
    } else {
      setError(result.error ?? "Gagal memuat data tutor.");
    }

    setLoading(false);
  }, [mode]);

  useEffect(() => {
    if (user?.role === "admin") {
      void loadAdminData();
    }
  }, [loadAdminData, user?.role]);

  const handleDecision = async (
    tutor: TutorAdminItem,
    decision: TutorReviewDecision,
  ) => {
    const requiresConfirmation = decision === "reject" || decision === "revoke";
    if (
      requiresConfirmation &&
      !window.confirm(
        `${decision === "reject" ? "Reject" : "Revoke"} tutor ${tutor.fullName}?`,
      )
    ) {
      return;
    }

    setSubmitting({ tutorId: tutor.id, decision });
    setError(null);

    const result = await reviewTutorAction(tutor.id, decision);
    if (result.success) {
      await loadAdminData();
    } else {
      setError(result.error ?? "Gagal memperbarui status tutor.");
    }

    setSubmitting(null);
  };

  const config = adminTutorReviewModeConfig[mode];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--gelap)]/10 bg-white shadow-sm">
      <div className="border-b border-[var(--gelap)]/10 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--biru)]/10 px-3 py-1 text-xs font-semibold text-[var(--biru)]">
              <UserCheck className="h-3.5 w-3.5" />
              Admin review
            </p>
            <h1 className="mt-3 text-2xl font-bold text-[var(--gelap)] sm:text-3xl">
              {config.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--gelap)]/60">
              {config.description}
            </p>
          </div>
          <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl border border-[var(--gelap)]/10 bg-[var(--putih)] px-4 py-3 text-sm text-[var(--gelap)]/65">
            Total:{" "}
            <span className="font-semibold text-[var(--gelap)]">
              {items.length}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
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
          ) : items.length === 0 ? (
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
            items.map((item) => (
              <AdminTutorCard
                key={item.id}
                item={item}
                mode={mode}
                submittingDecision={
                  submitting?.tutorId === item.id ? submitting.decision : null
                }
                onDecision={(decision) => void handleDecision(item, decision)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
