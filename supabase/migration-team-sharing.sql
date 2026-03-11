-- ============================================
-- TEAM-BASED DATA SHARING
-- Updates RLS policies so team members can see
-- each other's companies, loans, and alerts.
-- Run this in Supabase SQL Editor AFTER migration-teams.sql
-- ============================================

-- Helper function: returns all team_ids the current user belongs to
create or replace function public.get_user_team_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select team_id from public.team_members where user_id = auth.uid();
$$;

-- ============================================
-- COMPANIES — team members can view all companies in their team
-- ============================================

-- Drop existing policies
drop policy if exists "Users can view their own companies" on public.companies;
drop policy if exists "Users can insert their own companies" on public.companies;
drop policy if exists "Users can update their own companies" on public.companies;
drop policy if exists "Users can delete their own companies" on public.companies;

-- SELECT: user owns it OR it belongs to one of their teams
create policy "Users can view team companies"
  on public.companies for select
  using (
    user_id = auth.uid()
    or team_id in (select public.get_user_team_ids())
  );

-- INSERT: user must be authenticated, sets their own user_id
create policy "Users can insert companies"
  on public.companies for insert
  with check (user_id = auth.uid());

-- UPDATE: user owns it OR it belongs to their team
create policy "Users can update team companies"
  on public.companies for update
  using (
    user_id = auth.uid()
    or team_id in (select public.get_user_team_ids())
  );

-- DELETE: only the owner can delete
create policy "Users can delete their own companies"
  on public.companies for delete
  using (user_id = auth.uid());

-- ============================================
-- LOANS — visible if the parent company is visible
-- Loans link to companies via company_id.
-- ============================================

drop policy if exists "Users can view their own loans" on public.loans;
drop policy if exists "Users can insert their own loans" on public.loans;
drop policy if exists "Users can update their own loans" on public.loans;
drop policy if exists "Users can delete their own loans" on public.loans;

-- SELECT: loan's company must be visible to the user
create policy "Users can view team loans"
  on public.loans for select
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

-- INSERT: loan's company must belong to user or their team
create policy "Users can insert team loans"
  on public.loans for insert
  with check (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

-- UPDATE: same as select
create policy "Users can update team loans"
  on public.loans for update
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

-- DELETE: only if company belongs to the user directly
create policy "Users can delete their own loans"
  on public.loans for delete
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );

-- ============================================
-- ALERT_LOGS — visible if the related loan is visible
-- ============================================

drop policy if exists "Users can view their own alerts" on public.alert_logs;

-- Only add if the table exists (alert_logs or alerts)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'alert_logs' and table_schema = 'public') then
    execute '
      create policy "Users can view team alerts"
        on public.alert_logs for select
        using (
          loan_id in (
            select l.id from public.loans l
            join public.companies c on c.id = l.company_id
            where c.user_id = auth.uid()
               or c.team_id in (select public.get_user_team_ids())
          )
        )';
  end if;
end $$;

-- Same for alerts table if it exists
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'alerts' and table_schema = 'public') then
    execute 'drop policy if exists "Users can view their own alerts" on public.alerts';
    execute '
      create policy "Users can view team alerts"
        on public.alerts for select
        using (
          loan_id in (
            select l.id from public.loans l
            join public.companies c on c.id = l.company_id
            where c.user_id = auth.uid()
               or c.team_id in (select public.get_user_team_ids())
          )
        )';
  end if;
end $$;
