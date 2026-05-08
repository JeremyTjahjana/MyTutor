"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/app/components/AuthLayout";
import { GoogleAuthButton } from "@/app/components/GoogleAuthButton";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await login(
      fd.get("email") as string,
      fd.get("password") as string,
    );
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <AuthLayout mode="login">
      <h2 className="mb-1 text-[26px] font-bold text-[var(--biru)]">
        Selamat datang kembali
      </h2>
      <p className="mb-6 text-sm text-[var(--gelap)]/55">
        Masukkan email dan password untuk melanjutkan.
      </p>

      {/* Google Sign-in */}
      <GoogleAuthButton />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--gelap)]/[0.08]" />
        <span className="text-xs font-medium text-[var(--gelap)]/35">atau</span>
        <div className="h-px flex-1 bg-[var(--gelap)]/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-semibold text-[var(--gelap)]"
          >
            Email
          </label>
          <input
            id="login-email"
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
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-semibold text-[var(--gelap)]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--biru)] hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[#F7F8FC] px-4 py-3 pr-12 text-[15px] text-[var(--gelap)] outline-none transition-colors placeholder:text-[var(--gelap)]/35 focus:border-[var(--biru)] focus:bg-white focus:ring-2 focus:ring-[var(--biru)]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gelap)]/40 hover:text-[var(--biru)] transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-1 flex w-full items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
