/**
 * Migration script: creates the notifications_sent table in Supabase.
 * Run with: node scripts/migrate-notifications.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dupcgcqwznhbobtvqheu.supabase.co';
const SERVICE_ROLE_KEY = process.env.NEXT_SECRET_SUPABASE_KEY;

if (!SERVICE_ROLE_KEY) {
  // Read from .env file if not set in environment
  const fs = await import('fs');
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/NEXT_SECRET_SUPABASE_KEY=(.+)/);
  if (match) {
    var key = match[1].trim();
  } else {
    console.error('Could not find NEXT_SECRET_SUPABASE_KEY in .env');
    process.exit(1);
  }
} else {
  var key = SERVICE_ROLE_KEY;
}

const sql = `
-- Create notifications_sent table
CREATE TABLE IF NOT EXISTS public.notifications_sent (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  loan_id uuid references public.loans(id) on delete cascade not null,
  notification_type text not null check (notification_type in ('maturity_30_day')),
  sent_at timestamptz default now() not null,
  recipient_email text not null,
  unique(loan_id, notification_type)
);

-- Enable RLS
ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;

-- Create policy (if not exists workaround)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications_sent' AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications"
      ON public.notifications_sent FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create index
CREATE INDEX IF NOT EXISTS idx_notifications_loan_type
  ON public.notifications_sent(loan_id, notification_type);
`;

// Try using the Supabase SQL endpoint (used by Supabase Studio)
async function runMigration() {
  console.log('Running migration against Supabase...');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  });

  // The /rest/v1/rpc endpoint won't work for DDL, so try the pg endpoint
  const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'x-request-id': crypto.randomUUID(),
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgResponse.ok) {
    const result = await pgResponse.json();
    console.log('Migration successful!');
    console.log(JSON.stringify(result, null, 2));
    return true;
  }

  // If /pg/query doesn't work, try the SQL API endpoint
  const sqlResponse = await fetch(`${SUPABASE_URL}/sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (sqlResponse.ok) {
    const result = await sqlResponse.json();
    console.log('Migration successful via /sql endpoint!');
    console.log(JSON.stringify(result, null, 2));
    return true;
  }

  console.error('Could not run migration via HTTP API.');
  console.error('/pg/query status:', pgResponse.status, await pgResponse.text().catch(() => ''));
  console.error('/sql status:', sqlResponse.status, await sqlResponse.text().catch(() => ''));
  return false;
}

const success = await runMigration();

if (!success) {
  console.log('\n---');
  console.log('The HTTP endpoints are not available. Please run this SQL manually');
  console.log('in your Supabase Dashboard > SQL Editor:\n');
  console.log(sql);
}
