"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Booking } from "@/types/user";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Modal from "@/components/shared/ModalTestimoni";
import { createTestimonyAction } from "@/features/booking/services/booking.action";

type BookingListCardProps = {
  booking: Booking;
  onBookingUpdated?: () => void;
};

const statusConfig: Record<
  string,
  { label: string; pillClass: string; stripeClass: string }
> = {
  pending: {
    label: "Menunggu",
    pillClass: "bg-yellow-100 text-yellow-700",
    stripeClass: "bg-yellow-400",
  },
  accepted: {
    label: "Diterima",
    pillClass: "bg-green-100 text-green-700",
    stripeClass: "bg-green-400",
  },
  completed: {
    label: "Selesai",
    pillClass: "bg-[var(--ijo1)] text-[var(--putih)]",
    stripeClass: "bg-[var(--ijo1)]",
  },
  rejected: {
    label: "Ditolak",
    pillClass: "bg-red-100 text-red-600",
    stripeClass: "bg-red-400",
  },
  cancelled: {
    label: "Dibatalkan",
    pillClass: "bg-gray-100 text-gray-600",
    stripeClass: "bg-gray-300",
  },
};

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
  const hasTestimony = Boolean(booking.hasTestimony);
  const testimonialRating = booking.testimonyRating ?? 0;
  const statusInfo = statusConfig[booking.status] ?? statusConfig.pending;

  const handleContactTutor = () => {
    if (booking.tutorPhone) {
      let phone = booking.tutorPhone.replace(/\D/g, "");
      if (!phone.startsWith("62")) {
        phone = phone.startsWith("0")
          ? "62" + phone.substring(1)
          : "62" + phone;
      }
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <article className="flex w-full max-w-[360px] flex-col overflow-hidden rounded-[28px] border border-[#d7d3ef] bg-[var(--putih)] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]">

      {/* Color stripe — visual status cue */}
      <div className={`h-1.5 w-full ${statusInfo.stripeClass}`} />

      <div className="flex flex-1 flex-col justify-center px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">

        {/* Header: avatar + subject + tutor + status */}
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[#f6f6fb] sm:h-16 sm:w-16">
            <Image
              src={booking.tutorAvatarUrl ?? assets.mehehe}
              alt={booking.tutorName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h4 className="min-w-0 flex-1 break-words text-[20px] font-semibold leading-tight text-[var(--gelap)] sm:text-[22px]">
                {booking.subjectName}
              </h4>
              <span
                className={`mt-0.5 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold leading-none sm:text-[12px] ${statusInfo.pillClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--gelap)] opacity-50 sm:text-[13px]">
              {booking.tutorName}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-[#d7d3ef]/60" />

        {/* Schedule block */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f6f6fb]">
            {/* Calendar icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--gelap)] opacity-40"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gelap)] opacity-40">
              Jadwal Tutor
            </p>
            <p className="mt-0.5 text-[15px] font-medium text-[var(--gelap)] sm:text-[16px]">
              {formatDay(booking.startTime)}{" "}
              <span className="opacity-60">
                ({formatTime(booking.startTime)} – {formatTime(booking.endTime)})
              </span>
            </p>
          </div>
        </div>

        {/* Footer actions */}
        {booking.status === "completed" && hasTestimony ? (
          <div className="mt-5 border-t border-[#d7d3ef]/60 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gelap)] opacity-40">
                  Rating kamu
                </p>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-[20px] leading-none sm:text-[22px] ${
                        i < testimonialRating
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
                className="flex items-center gap-1.5 rounded-full bg-[var(--ijo1)] px-4 py-2.5 text-[13px] font-semibold text-[var(--putih)] transition-opacity hover:opacity-85"
              >
                Belajar Lagi
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        ) : booking.status === "completed" ? (
          <button
            type="button"
            className="btn-secondary mt-5 w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Beri Testimoni
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary mt-5 flex w-full items-center justify-center gap-2"
            onClick={handleContactTutor}
            disabled={!booking.tutorPhone}
            title={
              booking.tutorPhone
                ? "Chat di WhatsApp"
                : "Nomor telepon tidak tersedia"
            }
          >
            {/* WhatsApp icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
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