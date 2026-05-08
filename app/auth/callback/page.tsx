"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    /**
     * For Google OAuth (PKCE flow), Supabase redirects back with ?code=...
     * The Supabase client auto-exchanges it via onAuthStateChange.
     * We also ensure the user row exists in public.users (Google users
     * won't have been inserted by the register flow).
     */
    const ensureUserProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login?error=auth");
        return;
      }

      const { id, email, user_metadata } = session.user;

      // Upsert so Google users get a public.users row on first login
      await supabase.from("users").upsert(
        {
          id,
          email: email ?? "",
          full_name: user_metadata?.full_name ?? user_metadata?.name ?? "",
          avatar_url: user_metadata?.avatar_url ?? user_metadata?.picture ?? null,
          role: "student",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      router.replace("/");
    };

    // Give the onAuthStateChange listener a moment to fire first
    const timer = setTimeout(ensureUserProfile, 300);
    return () => clearTimeout(timer);
  }, [router]);

  // Fallback: once AuthContext resolves, redirect
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
