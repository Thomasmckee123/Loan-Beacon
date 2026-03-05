import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * This bypasses Row Level Security — only use in server-side
 * API routes and cron jobs, never in client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_SECRET_SUPABASE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_SECRET_SUPABASE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
