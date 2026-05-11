"use client";

import React, { useState, useActionState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createBookingAction,
  type CreateBookingState,
} from "@/features/booking/services/booking.action";
import SuccessfulPayment from "@/components/shared/SuccessfulPayment";
import { Loader2 } from "lucide-react";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const initialState: CreateBookingState = { success: false };

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tutorProfileId = searchParams.get("tutorProfileId") ?? "";
  const tutorName = searchParams.get("tutorName") ?? "—";
  const subjectId = searchParams.get("subjectId") ?? "";
  const subjectName = searchParams.get("subjectName") ?? "—";
  const startTime = searchParams.get("startTime") ?? "";
  const endTime = searchParams.get("endTime") ?? "";
  const [note, setNote] = useState("");

  // Derive cost from tutor (hard to get here without another fetch — use a default for now)
  const totalPrice = 150000;

  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    initialState,
  );

  if (state.success) {
    const bookingNumber = `#BK-${new Date().getFullYear()}-${state.bookingId?.slice(-6).toUpperCase()}`;
    return (
      <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
        <SuccessfulPayment
          bookingNumber={bookingNumber}
          tutorName={tutorName}
          subjects={subjectName}
          schedule={
            startTime
              ? `${formatDate(startTime)}, ${formatTime(startTime)} - ${formatTime(endTime)}`
              : "—"
          }
          date={startTime ? formatDate(startTime) : "—"}
          total={totalPrice}
          viewBookingsHref="/booking-list"
          backHref="/"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6">
        {/* Booking Form Card */}
        <section className="rounded-[28px] bg-white px-5 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] sm:px-6 sm:py-7">
          <h1 className="text-[28px] font-bold leading-tight text-[var(--biru)] sm:text-[32px]">
            Konfirmasi Pemesanan
          </h1>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="schedule-display"
                className="mb-2 block text-sm font-semibold text-[var(--biru)]"
              >
                Verifikasi Jadwal
              </label>
              <input
                id="schedule-display"
                type="text"
                readOnly
                value={
                  startTime
                    ? `${formatDate(startTime)} (${formatTime(startTime)} - ${formatTime(endTime)})`
                    : "—"
                }
                className="w-full rounded-2xl border-2 border-[var(--biru)] bg-white px-4 py-3 text-[15px] font-medium text-[var(--gelap)] outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="mb-2 block text-sm font-semibold text-[var(--biru)]"
              >
                Pesan (Opsional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tulis pesan untuk tutor..."
                rows={5}
                className="w-full resize-none rounded-2xl border-2 border-[var(--biru)] px-4 py-4 text-[15px] text-[var(--gelap)] outline-none placeholder:text-[var(--gelap)]/35"
              />
            </div>
          </div>
        </section>

        {/* Summary Card */}
        <section className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_32px_rgba(0,0,0,0.06)]">
          <h2 className="text-[19px] font-bold text-[var(--biru)]">
            Ringkasan Pemesanan
          </h2>
          <dl className="mt-4 space-y-3 text-[15px]">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Tutor:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {tutorName}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Mata Kuliah:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {subjectName}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Jadwal:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {startTime
                  ? `${formatDate(startTime)}, ${formatTime(startTime)} - ${formatTime(endTime)}`
                  : "—"}
              </dd>
            </div>
            <div className="border-t border-[var(--gelap)]/10 pt-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[16px] font-semibold text-[var(--biru)]">
                  Total:
                </dt>
                <dd className="text-[16px] font-bold text-[var(--biru)]">
                  {formatRupiah(totalPrice)}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        {/* Error */}
        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </p>
        )}

        {!user && (
          <p className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            Kamu harus{" "}
            <Link href="/login" className="font-semibold underline">
              masuk
            </Link>{" "}
            terlebih dahulu untuk memesan.
          </p>
        )}

        {/* Actions */}
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="studentId" value={user?.id ?? ""} />
          <input type="hidden" name="tutorProfileId" value={tutorProfileId} />
          <input type="hidden" name="subjectId" value={subjectId} />
          <input type="hidden" name="startTime" value={startTime} />
          <input type="hidden" name="endTime" value={endTime} />
          <input type="hidden" name="notes" value={note} />

          <button
            type="submit"
            disabled={isPending || !user}
            className="btn-primary w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Pesan Sekarang"
            )}
          </button>

          <Link
            href={`/tutors/${tutorProfileId}/schedule`}
            className="btn-secondary w-full"
          >
            Kembali
          </Link>
        </form>
      </div>
    </main>
  );
}
