"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const ensureUserProfile = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hasLegacyHashTokens =
        url.hash.includes("access_token=") ||
        url.hash.includes("refresh_token=") ||
        url.hash.includes("provider_token=");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("auth callback code exchange error", error);
          router.replace("/login?error=auth");
          return;
        }
      }

      // Remove query/hash artifacts from OAuth callback URL as soon as possible.
      if (code || hasLegacyHashTokens) {
        window.history.replaceState({}, "", "/auth/callback");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login?error=auth");
        return;
      }

      const { id, email, user_metadata } = session.user;

      await supabase.from("users").upsert(
        {
          id,
          email: email ?? "",
          full_name: user_metadata?.full_name ?? user_metadata?.name ?? "",
          avatar_url:
            user_metadata?.avatar_url ?? user_metadata?.picture ?? null,
          role: "student",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      router.replace("/");
    };

    const timer = setTimeout(ensureUserProfile, 300);
    return () => clearTimeout(timer);
  }, [router]);
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      <p className="text-sm text-[var(--gelap)]/50">Memverifikasi akun...</p>
    </div>
  );
}
