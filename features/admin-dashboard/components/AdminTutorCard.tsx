"use client";

import {
  BadgeCheck,
  FileText,
  Loader2,
  UserMinus,
  UserX,
} from "lucide-react";

import { formatCurrency, formatSubmittedDate } from "../utils";
import type {
  AdminTutorReviewMode,
  TutorAdminItem,
  TutorReviewDecision,
} from "../types";

type AdminTutorCardProps = {
  item: TutorAdminItem;
  mode: AdminTutorReviewMode;
  submittingDecision: TutorReviewDecision | null;
  onDecision: (decision: TutorReviewDecision) => void;
};

function ContractLink({ item }: { item: TutorAdminItem }) {
  if (!item.contractPdfUrl) {
    return <span className="text-sm text-[var(--gelap)]/45">Belum ada PDF</span>;
  }

  return (
    <a
      href={item.contractPdfUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--gelap)]/10 px-3 py-2 text-sm font-medium text-[var(--biru)] hover:bg-[var(--biru)]/5"
    >
      <FileText className="h-4 w-4" />
      {item.contractPdfName ?? "Lihat PDF"}
    </a>
  );
}

function ActionIcon({
  decision,
  loading,
}: {
  decision: TutorReviewDecision;
  loading: boolean;
}) {
  if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (decision === "approve") return <BadgeCheck className="h-4 w-4" />;
  if (decision === "reject") return <UserX className="h-4 w-4" />;
  return <UserMinus className="h-4 w-4" />;
}

export default function AdminTutorCard({
  item,
  mode,
  submittingDecision,
  onDecision,
}: AdminTutorCardProps) {
  const isSubmitting = submittingDecision !== null;
  const isApproved = item.tutorStatus === "approved";

  const actionButton = (
    decision: TutorReviewDecision,
    label: string,
    className: string,
  ) => (
    <button
      type="button"
      onClick={() => onDecision(decision)}
      disabled={isSubmitting}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <ActionIcon
        decision={decision}
        loading={submittingDecision === decision}
      />
      {label}
    </button>
  );

  return (
    <article className="rounded-2xl border border-[var(--gelap)]/10 bg-[var(--putih)] p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-[var(--gelap)]">
              {item.fullName}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isApproved
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
            <span className="text-xs text-[var(--gelap)]/45">
              {formatSubmittedDate(item.createdAt)}
            </span>
          </div>

          <div className="grid gap-x-5 gap-y-1.5 text-sm text-[var(--gelap)]/70 sm:grid-cols-2 xl:grid-cols-4">
            <p className="min-w-0 truncate">
              <span className="font-medium text-[var(--gelap)]">Email:</span>{" "}
              {item.email}
            </p>
            <p className="min-w-0 truncate">
              <span className="font-medium text-[var(--gelap)]">Phone:</span>{" "}
              {item.phone ?? "-"}
            </p>
            <p className="min-w-0 truncate">
              <span className="font-medium text-[var(--gelap)]">
                Experience:
              </span>{" "}
              {item.experience || "-"}
            </p>
            <p className="min-w-0 truncate">
              <span className="font-medium text-[var(--gelap)]">Rate:</span>{" "}
              {formatCurrency(item.costPerHour)}
            </p>
          </div>

          {item.bio && (
            <div className="line-clamp-2 rounded-xl bg-white px-3 py-2 text-sm text-[var(--gelap)]/70">
              <p>{item.bio}</p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 xl:justify-end">
          <ContractLink item={item} />
          {mode === "pendaftaran" ? (
            <>
              {actionButton(
                "reject",
                "Reject tutor",
                "border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50",
              )}
              {actionButton(
                "approve",
                "Approve tutor",
                "bg-[var(--biru)] text-white transition-opacity hover:opacity-95",
              )}
            </>
          ) : (
            actionButton(
              "revoke",
              "Revoke tutor",
              "border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50",
            )
          )}
        </div>
      </div>
    </article>
  );
}
