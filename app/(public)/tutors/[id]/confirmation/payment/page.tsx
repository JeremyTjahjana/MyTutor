"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tutorId = params?.id ?? "";

  // Read total from query or fallback
  const total = Number(searchParams.get("total")) || 150000;

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true);
      // Redirect back to confirmation after a short delay so user can see expired state
      const t = setTimeout(() => {
        const q = searchParams.toString();
        router.push(`/tutors/${tutorId}/confirmation${q ? `?${q}` : ""}`);
      }, 600);
      return () => clearTimeout(t);
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const confirmationHref = `/tutors/${tutorId}/confirmation${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-center text-xl font-bold text-[var(--biru)] mb-4">
          Pembayaran QRIS
        </h1>

        <div className="rounded-xl border-2 border-[var(--biru)] bg-white p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[220px] h-[220px] bg-[#fff] rounded-md flex items-center justify-center shadow-sm">
              {/* Placeholder QR square */}
              <div className="w-[180px] h-[180px] bg-[rebeccapurple]/5 border rounded-sm flex items-center justify-center text-xs text-[var(--gelap)]">
                QR CODE
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[var(--gelap)]">Total Pembayaran</p>
              <p className="text-[20px] font-bold text-[var(--biru)]">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="w-full rounded-md bg-[#F3F4F8] py-3 text-center">
              <p className="text-[12px] text-[var(--gelap)]/70">
                Waktu Pembayaran
              </p>
              <p
                className={`text-2xl font-bold ${expired ? "text-red-500" : "text-[var(--biru)]"}`}
              >
                {minutes}:{seconds}
              </p>
              {expired ? (
                <p className="text-xs text-red-400 mt-1">
                  QR Code sudah kedaluwarsa
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                // Redirect to confirmation with paid=true
                const q = new URLSearchParams(searchParams);
                q.set("paid", "true");
                router.push(`/tutors/${tutorId}/confirmation?${q.toString()}`);
              }}
              className="btn-primary w-full"
            >
              Selesai Bayar
            </button>

            <button
              type="button"
              onClick={() => router.push(confirmationHref)}
              className="btn-secondary w-full"
            >
              Kembali ke Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
