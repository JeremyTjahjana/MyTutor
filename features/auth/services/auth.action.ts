"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase/server";

const authClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export type SignupState = {
  success: boolean;
  error?: string;
};

async function getAuthCallbackUrl() {
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    (headerStore.get("host")
      ? `${headerStore.get("x-forwarded-proto") ?? "http"}://${headerStore.get("host")}`
      : process.env.NEXT_PUBLIC_SITE_URL);

  return origin ? `${origin}/auth/callback` : undefined;
}

export async function signupStudentAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = (formData.get("fullName") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { success: false, error: "Password tidak cocok." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, error: "Email tidak valid." };
  }

  // 1. Create Supabase auth user
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "student" },
      emailRedirectTo: await getAuthCallbackUrl(),
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Gagal membuat akun.",
    };
  }

  // 2. Upsert into public.users
  const { error: upsertError } = await supabase.from("users").upsert({
    id: authData.user.id,
    full_name: fullName,
    email,
    role: "student",
  });

  if (upsertError) {
    console.error("signupStudentAction: upsert error", upsertError);
    // Non-fatal — trigger may have already created the row
  }

  return { success: true };
}
