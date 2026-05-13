"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const redirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If AuthContext already has the profile, allow immediate redirect.
    if (!authLoading && user) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        router.replace("/");
      }
      return;
    }

    // Prevent multiple redirect attempts
    if (redirectedRef.current) return;

    const ensureUserProfile = async () => {
      try {
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
          console.error("No session found after code exchange");
          redirectedRef.current = true;
          router.replace("/login?error=auth");
          return;
        }

        const { id, email, user_metadata } = session.user;

        const { error: upsertError } = await supabase.from("users").upsert(
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

        if (upsertError) {
          console.error("auth callback upsert error", upsertError);
          // Still continue even if upsert fails, since session is valid
        }

        // Refresh AuthContext immediately so navbar/sidebar can render the profile
        // without waiting for a manual refresh.
        const profile = await refreshUser();

        if (!profile) {
          console.error("auth callback refreshUser returned no profile");
          redirectedRef.current = true;
          router.replace("/login?error=auth");
          return;
        }

        // Give React one paint cycle so the updated auth state is committed
        // before we leave the callback page.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });

        redirectedRef.current = true;
        router.replace("/");
      } catch (err) {
        console.error("auth callback error", err);
        redirectedRef.current = true;
        router.replace("/login?error=auth");
      }
    };

    // Set a timeout to fail fast if callback takes too long.
    const timeoutId = setTimeout(() => {
      if (!redirectedRef.current) {
        console.warn("auth callback timeout, redirecting to login");
        redirectedRef.current = true;
        router.replace("/login?error=auth");
      }
    }, 5000);

    ensureUserProfile();
    return () => clearTimeout(timeoutId);
  }, [router, user, authLoading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      <p className="text-sm text-[var(--gelap)]/50">Memverifikasi akun...</p>
    </div>
  );
}
