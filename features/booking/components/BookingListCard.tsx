"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import type { Booking } from "@/types/user";
import { assets } from "@/assets/assets";
import Modal from "@/components/shared/ModalTestimoni";
import {
  completeBookingAction,
  createTestimonyAction,
} from "@/features/booking/services/booking.action";

type BookingListCardProps = {
  booking: Booking;
  onBookingUpdated?: () => void;
};

const statusConfig: Record<string, { label: string; pillClass: string }> = {
  pending: {
    label: "Menunggu",
    pillClass: "bg-yellow-100 text-yellow-700",
  },
  accepted: {
    label: "Diterima",
    pillClass: "bg-green-100 text-green-700",
  },
  completed: {
    label: "Selesai",
    pillClass: "bg-[var(--ijo1)] text-[var(--putih)]",
  },
  rejected: {
    label: "Ditolak",
    pillClass: "bg-red-100 text-red-600",
  },
  cancelled: {
    label: "Dibatalkan",
    pillClass: "bg-gray-100 text-gray-600",
  },
};

const primaryButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--biru)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00a0bc] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--biru)] px-4 py-2.5 text-sm font-semibold text-[var(--biru)] transition hover:bg-[var(--biru)]/5 disabled:cursor-not-allowed disabled:opacity-60";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { weekday: "long" });

const BookingListCard = ({
  booking,
  onBookingUpdated,
}: BookingListCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const hasTestimony = Boolean(booking.hasTestimony);
  const testimonialRating = booking.testimonyRating ?? 0;
  const statusInfo = statusConfig[booking.status] ?? statusConfig.pending;
  const studentHasConfirmed = Boolean(booking.studentCompletedAt);
  const tutorHasConfirmed = Boolean(booking.tutorCompletedAt);

  const handleContactTutor = () => {
    if (booking.tutorPhone) {
      let phone = booking.tutorPhone.replace(/\D/g, "");
      if (!phone.startsWith("62")) {
        phone = phone.startsWith("0")
          ? `62${phone.substring(1)}`
          : `62${phone}`;
      }
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  const handleCompleteBooking = async () => {
    setIsCompleting(true);
    try {
      await completeBookingAction(booking.id, "student");
      onBookingUpdated?.();
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <article className="flex h-full min-h-[410px] w-full max-w-[360px] flex-col rounded-[26px] border border-[#d7d3ef] bg-[var(--putih)] p-6 shadow-[0px_6px_0px_rgba(15,23,42,0.14),0px_10px_18px_rgba(15,23,42,0.16)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[#f6f6fb]">
          <Image
            src={booking.tutorAvatarUrl ?? assets.profile}
            alt={booking.tutorName}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h4 className="line-clamp-2 min-h-[3.5rem] flex-1 text-xl font-semibold leading-tight text-[var(--gelap)]">
              {booking.subjectName}
            </h4>
            <span
              className={`mt-0.5 shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.pillClass}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-2 truncate text-xs font-bold uppercase tracking-[0.22em] text-[var(--gelap)]/45">
            {booking.tutorName}
          </p>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-[#d7d3ef]/70" />

      <div className="flex min-h-[64px] items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f6fb] text-[var(--gelap)]/40">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gelap)]/40">
            Jadwal tutor
          </p>
          <p className="mt-1 text-base font-medium leading-snug text-[var(--gelap)]">
            {formatDay(booking.startTime)}{" "}
            <span className="text-[var(--gelap)]/60">
              ({formatTime(booking.startTime)} - {formatTime(booking.endTime)})
            </span>
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5">
        {booking.status === "accepted" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f6f6fb] p-3 text-xs text-[var(--gelap)]/65">
              <div>
                <p className="font-semibold text-[var(--gelap)]/80">Murid</p>
                <p>{studentHasConfirmed ? "Sudah selesai" : "Belum selesai"}</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--gelap)]/80">Tutor</p>
                <p>{tutorHasConfirmed ? "Sudah selesai" : "Belum selesai"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={primaryButtonClass}
                onClick={handleCompleteBooking}
                disabled={isCompleting || studentHasConfirmed}
              >
                {studentHasConfirmed
                  ? "Menunggu"
                  : isCompleting
                    ? "Proses..."
                    : "Selesai"}
              </button>

              <button
                type="button"
                className={secondaryButtonClass}
                onClick={handleContactTutor}
                disabled={!booking.tutorPhone}
                title={
                  booking.tutorPhone
                    ? "Chat di WhatsApp"
                    : "Nomor telepon tidak tersedia"
                }
              >
                <MessageCircle className="h-4 w-4" />
                Kontak
              </button>
            </div>
          </div>
        ) : booking.status === "completed" && hasTestimony ? (
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gelap)]/40">
                Rating kamu
              </p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl leading-none ${
                      index < testimonialRating
                        ? "text-[#e4c813]"
                        : "text-black/15"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/tutors/${booking.tutorProfileId}`}
              className={primaryButtonClass}
            >
              Belajar lagi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : booking.status === "completed" ? (
          <button
            type="button"
            className={`${secondaryButtonClass} w-full`}
            onClick={() => setIsModalOpen(true)}
          >
            Beri Testimoni
          </button>
        ) : (
          <button
            type="button"
            className={`${primaryButtonClass} w-full`}
            onClick={handleContactTutor}
            disabled={!booking.tutorPhone}
            title={
              booking.tutorPhone
                ? "Chat di WhatsApp"
                : "Nomor telepon tidak tersedia"
            }
          >
            <MessageCircle className="h-4 w-4" />
            Kontak tutor
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tutorName={booking.tutorName}
        tutorAvatarUrl={booking.tutorAvatarUrl}
        subjectName={booking.subjectName}
        onSubmit={async ({ rating, testimonial }) => {
          const result = await createTestimonyAction({
            bookingId: booking.id,
            studentId: booking.studentId,
            tutorProfileId: booking.tutorProfileId,
            rating,
            message: testimonial,
          });

          if (!result.success) {
            throw new Error(result.error ?? "Gagal mengirim testimoni.");
          }

          onBookingUpdated?.();
        }}
      />
    </article>
  );
};

export default BookingListCard;
