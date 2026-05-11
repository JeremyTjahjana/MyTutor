"use client";

import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-white">
      {/* ── Full-width bottom waves (z-0) ──────────────────────────────── */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveBack" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a73c5" stopOpacity="0.09" />
            <stop offset="50%" stopColor="#2ec4b6" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1a73c5" stopOpacity="0.07" />
          </linearGradient>
          <linearGradient id="waveMid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2ec4b6" stopOpacity="0.13" />
            <stop offset="60%" stopColor="#1a73c5" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#2ec4b6" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="waveFront" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a73c5" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#2ec4b6" stopOpacity="0.09" />
          </linearGradient>
        </defs>
        <path
          d="M0,180 C200,110 400,210 600,150 C800,90 1050,200 1260,130 C1360,100 1420,145 1440,120 L1440,260 L0,260 Z"
          fill="url(#waveBack)"
        />
        <path
          d="M0,210 C180,160 380,235 560,190 C740,145 940,225 1120,175 C1280,135 1390,195 1440,168 L1440,260 L0,260 Z"
          fill="url(#waveMid)"
        />
        <path
          d="M0,238 C260,210 520,252 780,232 C1020,212 1260,248 1440,228 L1440,260 L0,260 Z"
          fill="url(#waveFront)"
        />
      </svg>

      {/* ── Left Panel ─────────────────────────────────────────────────── */}
      <div className="relative z-10 hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col items-center justify-center px-12 py-16">
        {/* Concentric rings behind logo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-full border border-[var(--biru)]/[0.06]" />
          <div className="absolute h-80 w-80 rounded-full border border-[var(--biru)]/[0.05]" />
          <div className="absolute h-[26rem] w-[26rem] rounded-full border border-[var(--biru)]/[0.035]" />
          <div className="absolute h-[34rem] w-[34rem] rounded-full border border-[#2ec4b6]/[0.03]" />
        </div>

        {/* Subtle centre glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #2ec4b620 0%, #1a73c510 60%, transparent 80%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src={assets.logoreal}
            alt="MyTutor"
            width={280}
            height={280}
            className="h-auto w-48 xl:w-60 object-contain drop-shadow-sm"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="relative z-10 mt-5 text-center text-[15px] leading-relaxed text-[var(--gelap)]/40 max-w-[220px]">
          Platform bimbingan belajar
          <br />
          mahasiswa IPB University
        </p>

        {/* Floating badge — top left */}
        <div className="absolute left-8 top-[28%] z-10 flex items-center gap-2 rounded-full border border-[var(--biru)]/10 bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--biru)] shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--biru)]" />
          200+ Tutor Aktif
        </div>

        {/* Floating badge — bottom right */}
        <div className="absolute bottom-[28%] right-6 z-10 flex items-center gap-2 rounded-full border border-[#2ec4b6]/15 bg-white/80 px-4 py-2 text-xs font-semibold text-[#1a8f86] shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#2ec4b6]" />★ 4.9 Rating
        </div>

        {/* Floating badge — top right */}
        <div className="absolute right-8 top-[22%] z-10 flex items-center gap-2 rounded-full border border-[#2ec4b6]/10 bg-white/80 px-4 py-2 text-xs font-semibold text-[#1a8f86] shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#2ec4b6]" />
          1.2k+ Sesi
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="absolute bottom-8 z-10 text-sm text-[var(--gelap)]/30 hover:text-[var(--biru)] transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>

      {/* ── Right Panel (no background — inherits white from parent) ───── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          {/* Mobile logo — logo2 (horizontal) */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Image
              src={assets.logo2}
              alt="MyTutor"
              width={180}
              height={60}
              className="h-auto w-40 object-contain"
              priority
            />
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-2xl border border-[var(--gelap)]/[0.08] bg-white p-1 shadow-sm">
            <Link
              href="/login"
              className={`flex-1 rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-[var(--biru)] text-white shadow-sm"
                  : "text-[var(--gelap)]/50 hover:text-[var(--gelap)]"
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className={`flex-1 rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-[var(--biru)] text-white shadow-sm"
                  : "text-[var(--gelap)]/50 hover:text-[var(--gelap)]"
              }`}
            >
              Daftar
            </Link>
          </div>

          {/* Form card */}
          <div className="rounded-[28px] bg-white px-8 py-8 shadow-[0_16px_48px_rgba(26,115,197,0.09)] ring-1 ring-[var(--gelap)]/[0.05]">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-[var(--gelap)]/40">
            Daftar sebagai tutor?{" "}
            <Link
              href="/register-tutor"
              className="font-semibold text-[var(--biru)] hover:underline"
            >
              Registrasi Tutor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
