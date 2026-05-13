import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Service-role Supabase client (bypasses RLS).
 * Use for admin operations only.
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey =
  serviceRoleKey ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/**
 * Per-request Supabase client that reads/writes auth tokens via cookies.
 * Must be called inside a Server Component, Route Handler, or Server Action
 * (anywhere `next/headers` cookies() is available).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` can fail in Server Components (read-only cookies).
            // This is fine — it only matters in Route Handlers / Server Actions.
          }
        },
      },
    },
  );
}
