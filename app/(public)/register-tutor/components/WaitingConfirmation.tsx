"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export default function WaitingConfirmation() {
  return (
    <div className="min-h-screen bg-[var(--putih)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[var(--biru)]/10 flex items-center justify-center">
            <Clock className="w-12 h-12 text-[var(--biru)]" strokeWidth={2} />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-3">
          Menunggu Konfirmasi
        </h1>
        <p className="text-base text-[var(--gelap)]/70 mb-2">
          Pendaftaran tutor Anda sedang dalam proses verifikasi oleh admin.
        </p>
        <p className="text-sm text-[var(--gelap)]/50 mb-8">
          Anda akan menerima notifikasi melalui email setelah pendaftaran
          dikonfirmasi. Harap tunggu dan periksa email Anda secara berkala.
        </p>

        {/* Back to home */}
        <Link href="/" className="btn-primary w-full inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
