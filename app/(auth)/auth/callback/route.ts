import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();

    // Exchange the OAuth code for a session (PKCE verifier is in the cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure the user profile exists in public.users
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { id, email, user_metadata } = user;
        await supabase.from("users").upsert(
          {
            id,
            email: email ?? "",
            full_name:
              user_metadata?.full_name ?? user_metadata?.name ?? "",
            avatar_url:
              user_metadata?.avatar_url ?? user_metadata?.picture ?? null,
            role: "student",
          },
          { onConflict: "id", ignoreDuplicates: true },
        );
      }

      // Redirect to home (or wherever `next` points)
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If code exchange failed or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
