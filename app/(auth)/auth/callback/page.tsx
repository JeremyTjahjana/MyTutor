"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple redirect attempts
    if (redirectedRef.current) return;

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
          redirectedRef.current = true;
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
        redirectedRef.current = true;
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

      redirectedRef.current = true;
      router.replace("/");
    };

    ensureUserProfile();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      <p className="text-sm text-[var(--gelap)]/50">Memverifikasi akun...</p>
    </div>
  );
}
