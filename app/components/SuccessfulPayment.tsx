"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  bookingNumber?: string;
  tutorName?: string;
  subjects?: string | string[];
  schedule?: string; // e.g. "Senin (13:00 - 14:30)"
  date?: string; // formatted date
  status?: string;
  total?: number;
  viewBookingsHref?: string;
  backHref?: string;
  onViewBookings?: () => void;
  onBack?: () => void;
};

const formatRupiah = (amount = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function SuccessfulPayment({
  bookingNumber = "#BK-2026-0001",
  tutorName = "Tutor",
  subjects = "-",
  schedule = "",
  date = "",
  status = "Dikonfirmasi",
  total = 150000,
  viewBookingsHref = "/bookinglist",
  backHref = "/",
  onViewBookings,
  onBack,
}: Props) {
  const router = useRouter();

  const handleView = () => {
    if (onViewBookings) return onViewBookings();
    router.push(viewBookingsHref);
  };

  const handleBack = () => {
    if (onBack) return onBack();
    router.push(backHref);
  };

  const subjectsText = Array.isArray(subjects) ? subjects.join(", ") : subjects;

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-green-100 p-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="11"
              stroke="#2AAF6D"
              strokeWidth="2"
              fill="#E6FBEE"
            />
            <path
              d="M7 12.5l2.5 2.5L17 8"
              stroke="#00A86B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[var(--biru)]">
          Pemesanan Berhasil!
        </h2>
        <p className="text-center text-sm text-[var(--gelap)]/85">
          Pemesanan Anda telah dikonfirmasi. Detail pembayaran telah dikirim ke
          email Anda.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <h3 className="text-center font-semibold text-[var(--biru)] mb-3">
          Detail Pemesanan
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--gelap)]/65">Nomor Booking:</dt>
            <dd className="font-semibold">{bookingNumber}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-[var(--gelap)]/65">Tutor:</dt>
            <dd className="font-semibold">{tutorName}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-[var(--gelap)]/65">Mata Kuliah:</dt>
            <dd className="font-semibold">{subjectsText}</dd>
          </div>

          {schedule ? (
            <div className="flex justify-between">
              <dt className="text-[var(--gelap)]/65">Jadwal:</dt>
              <dd className="font-semibold">{schedule}</dd>
            </div>
          ) : null}

          {date ? (
            <div className="flex justify-between">
              <dt className="text-[var(--gelap)]/65">Tanggal:</dt>
              <dd className="font-semibold">{date}</dd>
            </div>
          ) : null}

          <div className="flex justify-between">
            <dt className="text-[var(--gelap)]/65">Status:</dt>
            <dd className="font-semibold text-green-600">{status}</dd>
          </div>

          <div className="border-t border-[var(--gelap)]/10 pt-3">
            <div className="flex items-center justify-between">
              <dt className="text-base font-semibold text-[var(--biru)]">
                Total Bayar:
              </dt>
              <dd className="text-base font-bold text-[var(--biru)]">
                {formatRupiah(total)}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleView}
          className="btn-primary w-full"
        >
          Lihat Bookings
        </button>

        <button
          type="button"
          onClick={handleBack}
          className="btn-secondary w-full"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
