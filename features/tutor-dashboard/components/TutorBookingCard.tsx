"use client";

import Image from "next/image";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { assets } from "@/assets/assets";
import type { Booking } from "@/types/user";

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  accepted: {
    icon: CheckCircle,
    label: "Diterima",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  completed: {
    icon: CheckCircle,
    label: "Selesai",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Dibatalkan",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

const DAY_ID: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

function formatSchedule(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const day = DAY_ID[startDate.getDay()] ?? "";
  const startTime = startDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = endDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} (${startTime} - ${endTime})`;
}

type TutorBookingCardProps = {
  booking: Booking;
  actionLoading: string | null;
  onAction: (id: string, action: "accept" | "cancel" | "complete") => void;
};

export default function TutorBookingCard({
  booking,
  actionLoading,
  onAction,
}: TutorBookingCardProps) {
  const statusInfo =
    statusConfig[booking.status as keyof typeof statusConfig] ??
    statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-[var(--gelap)]/8 shadow-sm hover:shadow-md transition-all p-5 flex gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--gelap)]/10 shrink-0">
        <Image
          src={booking.tutorAvatarUrl ?? assets.profile}
          alt={booking.tutorName}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-[var(--gelap)] leading-tight">
              {booking.tutorName}
            </p>
            <p className="text-sm text-[var(--biru)] font-medium mt-0.5">
              {booking.subjectName}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusInfo.label}
          </span>
        </div>

        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--gelap)]/60">
          <Clock className="h-4 w-4 shrink-0 text-[var(--gelap)]/40" />
          <span>{formatSchedule(booking.startTime, booking.endTime)}</span>
        </p>
        {booking.notes && (
          <p className="mt-1.5 text-sm italic text-[var(--gelap)]/50">
            &quot;{booking.notes}&quot;
          </p>
        )}

        {booking.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onAction(booking.id, "accept")}
              disabled={!!actionLoading}
              className="btn-primary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5"
            >
              {actionLoading === booking.id + "accept" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              Terima
            </button>
            <button
              onClick={() => onAction(booking.id, "cancel")}
              disabled={!!actionLoading}
              className="btn-secondary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5"
            >
              {actionLoading === booking.id + "cancel" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Tolak
            </button>
          </div>
        )}

        {booking.status === "accepted" && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-[var(--gelap)]/55">
              Konfirmasi selesai: tutor{" "}
              {booking.tutorCompletedAt ? "sudah" : "belum"}, murid{" "}
              {booking.studentCompletedAt ? "sudah" : "belum"}.
            </p>
            <button
              onClick={() => onAction(booking.id, "complete")}
              disabled={!!actionLoading || Boolean(booking.tutorCompletedAt)}
              className="btn-primary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5"
            >
              {actionLoading === booking.id + "complete" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              {booking.tutorCompletedAt ? "Menunggu murid" : "Tandai Selesai"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
