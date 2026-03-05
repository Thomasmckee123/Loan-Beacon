-- ============================================
-- MIGRATION: Create notifications_sent table
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications_sent (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  loan_id uuid references public.loans(id) on delete cascade not null,
  notification_type text not null check (notification_type in ('maturity_30_day')),
  sent_at timestamptz default now() not null,
  recipient_email text not null,
  unique(loan_id, notification_type)
);

ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notifications_sent'
      AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications"
      ON public.notifications_sent FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notifications_loan_type
  ON public.notifications_sent(loan_id, notification_type);
