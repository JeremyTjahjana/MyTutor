import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Server-side Supabase client.
 * Uses the service-role key when available (bypasses RLS).
 * Falls back to the publishable anon key if no service-role key is configured.
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = serviceRoleKey ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Debug: log which key type is active (remove after confirming)
console.log(
  "[server/supabase] key type:",
  serviceRoleKey ? `service_role (...${serviceRoleKey.slice(-6)})` : "ANON — service role key NOT found",
);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
