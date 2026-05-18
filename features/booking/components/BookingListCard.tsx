"use client";

import React, { useState } from "react";
import type { Booking } from "@/types/user";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Modal from "@/components/shared/ModalTestimoni";
import { createTestimonyAction } from "@/features/booking/services/booking.action";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusInfo = statusConfig[booking.status] ?? statusConfig.pending;

  const handleContactTutor = () => {
    if (booking.tutorPhone) {
      // Remove non-numeric characters and add country code if needed
      let phone = booking.tutorPhone.replace(/\D/g, "");
      // If phone doesn't start with country code, assume Indonesia (62)
      if (!phone.startsWith("62")) {
        if (phone.startsWith("0")) {
          phone = "62" + phone.substring(1);
        } else {
          phone = "62" + phone;
        }
      }
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <article className="w-full max-w-90 rounded-2xl border border-(--gelap)/20 bg-(--putih) py-8 px-8 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.12)] sm:p-5">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-(--gelap)/20">
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
            <h4 className="text-xl leading-none font-semibold text-(--gelap) sm:text-[20px]">
              {booking.subjectName}
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-sm leading-none font-semibold ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-1 text-[15px] leading-none font-semibold uppercase tracking-widest text-(--gelap)/90 sm:text-[16px]">
            {booking.tutorName}
          </p>
        </div>
      </div>

      <div className="mt-5 text-[15px] leading-[1.3] text-(--gelap)/90 sm:mt-6 sm:text-[18px]">
        <p className="font-medium">Jadwal Tutor:</p>
        <p className="mt-1">
          {formatDay(booking.startTime)} ({formatTime(booking.startTime)} -{" "}
          {formatTime(booking.endTime)})
        </p>
      </div>

      <button
        type="button"
        className="btn-primary mt-6 w-full"
        onClick={handleContactTutor}
        disabled={!booking.tutorPhone}
        title={booking.tutorPhone ? "Chat di WhatsApp" : "Nomor telepon tidak tersedia"}
        style={{ display: booking.status === "completed" ? "none" : "inline-flex" }}
      >
        Kontak tutor
      </button>
      
      <button 
        type="button" 
        className="btn-secondary mt-6 w-full"
        onClick={() => setIsModalOpen(true)}
        style={{ display: booking.status === "completed" ? "inline-flex" : "none" }}
      >
        Beri Testimoni
      </button>

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
        }}
      />
    </article>
  );
};

export default BookingListCard;
