"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/shared/AuthLayout";
import {
  signupStudentAction,
  type SignupState,
} from "@/features/auth/services/auth.action";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/shared/GoogleAuthButton";

const initialState: SignupState = { success: false };

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(
    signupStudentAction,
    initialState,
  );

  if (state.success) {
    return (
      <AuthLayout mode="signup">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--biru)]">
            Akun berhasil dibuat!
          </h2>
          <p className="mt-3 text-sm text-[var(--gelap)]/60">
            Cek email kamu untuk verifikasi akun, lalu masuk.
          </p>
          <Link href="/login" className="btn-primary mt-8 w-full">
            Masuk Sekarang
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout mode="signup">
      <h2 className="mb-1 text-[26px] font-bold text-[var(--biru)]">
        Buat akun baru
      </h2>
      <p className="mb-6 text-sm text-[var(--gelap)]/55">
        Daftar sebagai mahasiswa dan mulai belajar bersama tutor terbaik.
      </p>

      {/* Google Sign-up */}
      <GoogleAuthButton />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--gelap)]/[0.08]" />
        <span className="text-xs font-medium text-[var(--gelap)]/35">
          atau daftar dengan email
        </span>
        <div className="h-px flex-1 bg-[var(--gelap)]/[0.08]" />
      </div>

      <form action={formAction} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-sm font-semibold text-[var(--gelap)]"
          >
            Nama Lengkap
          </label>
          <input
            id="signup-name"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama sesuai KTM"
            className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[#F7F8FC] px-4 py-3 text-[15px] text-[var(--gelap)] outline-none transition-colors placeholder:text-[var(--gelap)]/35 focus:border-[var(--biru)] focus:bg-white focus:ring-2 focus:ring-[var(--biru)]/10"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-sm font-semibold text-[var(--gelap)]"
          >
            Email IPB
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nama@apps.ipb.ac.id"
            className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[#F7F8FC] px-4 py-3 text-[15px] text-[var(--gelap)] outline-none transition-colors placeholder:text-[var(--gelap)]/35 focus:border-[var(--biru)] focus:bg-white focus:ring-2 focus:ring-[var(--biru)]/10"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-sm font-semibold text-[var(--gelap)]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[#F7F8FC] px-4 py-3 pr-12 text-[15px] text-[var(--gelap)] outline-none transition-colors placeholder:text-[var(--gelap)]/35 focus:border-[var(--biru)] focus:bg-white focus:ring-2 focus:ring-[var(--biru)]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gelap)]/40 hover:text-[var(--biru)] transition-colors"
              aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-1.5 block text-sm font-semibold text-[var(--gelap)]"
          >
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[#F7F8FC] px-4 py-3 pr-12 text-[15px] text-[var(--gelap)] outline-none transition-colors placeholder:text-[var(--gelap)]/35 focus:border-[var(--biru)] focus:bg-white focus:ring-2 focus:ring-[var(--biru)]/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gelap)]/40 hover:text-[var(--biru)] transition-colors"
              aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
            >
              {showConfirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </p>
        )}

        {/* Terms */}
        <p className="text-xs text-[var(--gelap)]/50">
          Dengan mendaftar, kamu menyetujui{" "}
          <Link href="#" className="text-[var(--biru)] hover:underline">
            Syarat & Ketentuan
          </Link>{" "}
          MyTutor.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Buat Akun"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
