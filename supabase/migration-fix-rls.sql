-- ============================================
-- FIX RLS
-- Run in Supabase Dashboard > SQL Editor. Idempotent.
-- Restores RLS and fixes recursive team policies.
--
-- Recursion fix: policies on team_members must never subquery
-- team_members directly. All membership lookups go through
-- security definer helpers, which bypass RLS.
-- ============================================

-- ============================================
-- 1. team_invites table (missing on live DB; must exist before
--    can_self_join_team is created)
-- ============================================
create table if not exists public.team_invites (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid references auth.users(id) on delete set null,
  token uuid default uuid_generate_v4() not null unique,
  expires_at timestamptz default (now() + interval '7 days') not null,
  accepted_at timestamptz,
  created_at timestamptz default now() not null,
  unique(team_id, email)
);

create index if not exists idx_team_invites_token on public.team_invites(token);
create index if not exists idx_team_invites_email on public.team_invites(email);

-- ============================================
-- 2. Helper functions (security definer = bypass RLS, no recursion)
-- ============================================

-- All team_ids the current user belongs to
create or replace function public.get_user_team_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select team_id from public.team_members where user_id = auth.uid();
$$;

-- Team_ids where the current user is owner or admin
create or replace function public.get_user_admin_team_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select team_id from public.team_members
  where user_id = auth.uid() and role in ('owner', 'admin');
$$;

-- Whether the current user may add themselves to a team with a given role:
--   (a) team has no members yet and role is 'owner' (team creator bootstrap), or
--   (b) a pending, unexpired invite for their email and that role exists
create or replace function public.can_self_join_team(p_team_id uuid, p_role text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    (
      p_role = 'owner'
      and not exists (select 1 from public.team_members tm where tm.team_id = p_team_id)
    )
    or exists (
      select 1 from public.team_invites ti
      where ti.team_id = p_team_id
        and lower(ti.email) = lower(auth.jwt() ->> 'email')
        and ti.role = p_role
        and ti.accepted_at is null
        and ti.expires_at > now()
    );
$$;

-- Accept an invite by token: validates it, adds the caller as a member and
-- marks it accepted in one step. Invitees get no UPDATE rights on
-- team_invites (RLS cannot lock team_id/role on update), so acceptance
-- happens only through this function.
-- Errors: P0002 invalid/expired, 42501 email mismatch, 23505 already member.
create or replace function public.accept_team_invite(p_token uuid)
returns uuid
language plpgsql
security definer
volatile
set search_path = public
as $$
declare
  v_invite public.team_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select * into v_invite from public.team_invites
  where token = p_token
    and accepted_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'Invalid or expired invite' using errcode = 'P0002';
  end if;

  if lower(v_invite.email) <> lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'This invite was sent to a different email address' using errcode = '42501';
  end if;

  insert into public.team_members (team_id, user_id, role)
  values (v_invite.team_id, auth.uid(), v_invite.role);

  update public.team_invites set accepted_at = now() where id = v_invite.id;

  return v_invite.team_id;
end;
$$;

revoke execute on function public.accept_team_invite(uuid) from public, anon;
grant execute on function public.accept_team_invite(uuid) to authenticated;

-- ============================================
-- 3. Drop every existing policy on managed tables
--    (live DB may hold unknown permissive policies)
-- ============================================
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('companies', 'loans', 'teams', 'team_members', 'team_invites', 'alert_logs', 'notifications_sent')
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- ============================================
-- 4. Enable RLS
-- ============================================
alter table public.companies enable row level security;
alter table public.loans enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;

do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'alert_logs' and table_schema = 'public') then
    execute 'alter table public.alert_logs enable row level security';
  end if;
  if exists (select 1 from information_schema.tables where table_name = 'notifications_sent' and table_schema = 'public') then
    execute 'alter table public.notifications_sent enable row level security';
  end if;
end $$;

-- ============================================
-- 5. Policies
-- ============================================

-- ---------- COMPANIES ----------
create policy "Users can view team companies"
  on public.companies for select
  using (
    user_id = auth.uid()
    or team_id in (select public.get_user_team_ids())
  );

create policy "Users can insert companies"
  on public.companies for insert
  with check (user_id = auth.uid());

create policy "Users can update team companies"
  on public.companies for update
  using (
    user_id = auth.uid()
    or team_id in (select public.get_user_team_ids())
  );

create policy "Users can delete their own companies"
  on public.companies for delete
  using (user_id = auth.uid());

-- ---------- LOANS ----------
create policy "Users can view team loans"
  on public.loans for select
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

create policy "Users can insert team loans"
  on public.loans for insert
  with check (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

create policy "Users can update team loans"
  on public.loans for update
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
         or team_id in (select public.get_user_team_ids())
    )
  );

create policy "Users can delete their own loans"
  on public.loans for delete
  using (
    company_id in (
      select id from public.companies
      where user_id = auth.uid()
    )
  );

-- ---------- ALERT_LOGS (guarded) ----------
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

-- ---------- NOTIFICATIONS_SENT (guarded) ----------
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'notifications_sent' and table_schema = 'public') then
    execute '
      create policy "Users can view their own notifications"
        on public.notifications_sent for select
        using (auth.uid() = user_id)';
  end if;
end $$;

-- ---------- TEAMS ----------
create policy "Users can view their teams"
  on public.teams for select
  using (id in (select public.get_user_team_ids()));

create policy "Users can create teams"
  on public.teams for insert
  with check (auth.uid() is not null);

create policy "Team admins can update teams"
  on public.teams for update
  using (id in (select public.get_user_admin_team_ids()));

-- ---------- TEAM_MEMBERS ----------
create policy "Users can view team members"
  on public.team_members for select
  using (team_id in (select public.get_user_team_ids()));

-- Admins add anyone; a user may add themselves only as creator-owner of an
-- empty team or via a pending invite (replaces old "or user_id = auth.uid()")
create policy "Team admins can add members"
  on public.team_members for insert
  with check (
    team_id in (select public.get_user_admin_team_ids())
    or (user_id = auth.uid() and public.can_self_join_team(team_id, role))
  );

create policy "Team admins can remove members"
  on public.team_members for delete
  using (
    team_id in (select public.get_user_admin_team_ids())
    or user_id = auth.uid()
  );

-- ---------- TEAM_INVITES ----------
create policy "Team admins can manage invites"
  on public.team_invites for all
  using (team_id in (select public.get_user_admin_team_ids()))
  with check (team_id in (select public.get_user_admin_team_ids()));

-- Invitee can read invites addressed to their email (replaces open read)
create policy "Users can view their own invites"
  on public.team_invites for select
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- No invitee UPDATE policy: acceptance goes through public.accept_team_invite()

-- ============================================
-- 6. Sanity check (run manually)
-- ============================================
-- select tablename, policyname, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('companies', 'loans', 'teams', 'team_members', 'team_invites', 'alert_logs', 'notifications_sent')
-- order by tablename, policyname;
