import React from "react";
import type { Booking } from "@/types/user";
import Image from "next/image";
import { assets } from "@/assets/assets";

type BookingListCardProps = {
  booking: Booking;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Diterima", className: "bg-green-100 text-green-700" },
  completed: {
    label: "Selesai",
    className: "bg-[var(--ijo1)] text-[var(--putih)]",
  },
  rejected: { label: "Ditolak", className: "bg-red-100 text-red-600" },
  cancelled: { label: "Dibatalkan", className: "bg-gray-100 text-gray-600" },
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/** Returns only the weekday name e.g. "Senin" */
const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
  });

const BookingListCard = ({ booking }: BookingListCardProps) => {
  const statusInfo = statusConfig[booking.status] ?? statusConfig.pending;

  return (
    <article className="w-full max-w-[360px] rounded-2xl border border-[var(--gelap)]/20 bg-[var(--putih)] py-8 px-8 sm:p-5 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--gelap)]/20">
          <Image
            src={booking.tutorAvatarUrl ?? assets.mehehe}
            alt={booking.tutorName}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xl leading-none font-semibold text-[var(--gelap)] sm:text-[20px]">
              {booking.subjectName}
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-sm leading-none font-semibold ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-1 text-[15px] leading-none font-semibold uppercase tracking-widest text-[var(--gelap)]/90 sm:text-[16px]">
            {booking.tutorName}
          </p>
        </div>
      </div>

      <div className="mt-5 text-[15px] leading-[1.3] text-[var(--gelap)]/90 sm:mt-6 sm:text-[18px]">
        <p className="font-medium">Jadwal Tutor:</p>
        <p className="mt-1">
          {formatDay(booking.startTime)} ({formatTime(booking.startTime)} -{" "}
          {formatTime(booking.endTime)})
        </p>
      </div>

      <button type="button" className="btn-primary mt-6 w-full">
        Kontak tutor
      </button>
    </article>
  );
};

export default BookingListCard;
