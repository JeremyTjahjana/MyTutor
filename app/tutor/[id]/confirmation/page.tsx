"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";
import SuccessfulPayment from "@/app/components/SuccessfulPayment";

const formatTimeRange = (start: string, end: string) => `${start} - ${end}`;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function ConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tutorId = Number(params.id);

  const tutor = useMemo(() => {
    return dummyTutor.find((item) => item.id === tutorId) ?? dummyTutor[0];
  }, [tutorId]);

  const selectedMatkulFromQuery =
    searchParams.get("matkul") ?? tutor.matkuls[0] ?? "";
  const selectedSchedule = useMemo(() => {
    const hari = searchParams.get("hari");
    const jamMulai = searchParams.get("jamMulai");
    const jamSelesai = searchParams.get("jamSelesai");
    const tanggal = searchParams.get("tanggal");

    const matchedSchedule = tutor.waktu.find(
      (item) =>
        item.hari === hari &&
        item.jamMulai === jamMulai &&
        item.jamSelesai === jamSelesai &&
        item.tanggal === tanggal,
    );

    return matchedSchedule ?? tutor.waktu[0];
  }, [searchParams, tutor.waktu]);

  const [note, setNote] = useState(searchParams.get("note") ?? "");

  const totalPrice = 150000;

  const isPaid = searchParams.get("paid") === "true";

  const bookingNumber = `#BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 1000}`;

  if (isPaid) {
    const hari = searchParams.get("hari") ?? "";
    const jamMulai = searchParams.get("jamMulai") ?? "";
    const jamSelesai = searchParams.get("jamSelesai") ?? "";
    const tanggal = searchParams.get("tanggal") ?? "";
    const matkul = searchParams.get("matkul") ?? "";

    const schedule = `${hari} (${jamMulai} - ${jamSelesai})`;

    return (
      <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
        <SuccessfulPayment
          bookingNumber={bookingNumber}
          tutorName={tutor.name}
          subjects={matkul}
          schedule={schedule}
          date={formatDate(tanggal)}
          total={totalPrice}
          viewBookingsHref="/bookinglist"
          backHref="/"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6">
        <section className="rounded-[28px] bg-white px-5 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] sm:px-6 sm:py-7">
          <h1 className="text-[28px] font-bold leading-tight text-[var(--biru)] sm:text-[32px]">
            Konfirmasi Pemesanan
          </h1>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="schedule"
                className="mb-2 block text-sm font-semibold text-[var(--biru)]"
              >
                Verifikasi Jadwal
              </label>
              <input
                id="schedule"
                type="text"
                readOnly
                value={`${selectedSchedule.hari}, ${formatDate(selectedSchedule.tanggal)} (${formatTimeRange(selectedSchedule.jamMulai, selectedSchedule.jamSelesai)})`}
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
                onChange={(event) => setNote(event.target.value)}
                placeholder="Tulis pesan untuk tutor..."
                rows={6}
                className="w-full resize-none rounded-2xl border-2 border-[var(--biru)] px-4 py-4 text-[15px] text-[var(--gelap)] outline-none placeholder:text-[var(--gelap)]/35"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_32px_rgba(0,0,0,0.06)]">
          <h2 className="text-[19px] font-bold text-[var(--biru)]">
            Ringkasan Pemesanan
          </h2>

          <dl className="mt-4 space-y-3 text-[15px]">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Tutor:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {tutor.name}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Mata Kuliah:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {selectedMatkulFromQuery}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[var(--gelap)]/65">Jadwal:</dt>
              <dd className="text-right font-semibold text-[var(--gelap)]">
                {selectedSchedule.hari}, {formatDate(selectedSchedule.tanggal)}{" "}
                (
                {formatTimeRange(
                  selectedSchedule.jamMulai,
                  selectedSchedule.jamSelesai,
                )}
                )
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

        <div className="flex flex-col gap-3">
          <Link
            href={`/tutor/${tutorId}/confirmation/payment${
              searchParams.toString()
                ? `?${searchParams.toString()}&total=${totalPrice}`
                : `?total=${totalPrice}`
            }`}
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[var(--biru)] px-6 py-3 text-center text-[16px] font-semibold text-white shadow-[0_14px_28px_rgba(0,138,180,0.28)] transition hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
          >
            Pembayaran (QRIS)
          </Link>

          <Link
            href="/tutor"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[var(--biru)] px-6 py-3 text-center text-[16px] font-semibold text-[var(--biru)] bg-white transition hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
          >
            Kembali
          </Link>
        </div>
      </div>
    </main>
  );
}
