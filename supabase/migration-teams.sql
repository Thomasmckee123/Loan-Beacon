-- ============================================
-- TEAMS & TEAM MEMBERS MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- Teams table
create table if not exists public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Team members (join table linking users to teams with roles)
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  invited_email text,
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz default now() not null,
  unique(team_id, user_id)
);

-- Pending invites (for users who haven't signed up yet)
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

-- Add team_id to companies if not already present
-- (The column may already exist from earlier schema; this is safe to re-run)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'companies' and column_name = 'team_id'
  ) then
    alter table public.companies add column team_id uuid references public.teams(id) on delete set null;
  end if;
end $$;

-- ============================================
-- RLS Policies
-- ============================================
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;

-- Teams: users can see teams they belong to
create policy "Users can view their teams"
  on public.teams for select
  using (
    id in (select team_id from public.team_members where user_id = auth.uid())
  );

-- Teams: any authenticated user can create a team
create policy "Users can create teams"
  on public.teams for insert
  with check (auth.uid() is not null);

-- Teams: only owner/admin can update
create policy "Team admins can update teams"
  on public.teams for update
  using (
    id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Team members: can see members of their own teams
create policy "Users can view team members"
  on public.team_members for select
  using (
    team_id in (select team_id from public.team_members where user_id = auth.uid())
  );

-- Team members: owner/admin can insert
create policy "Team admins can add members"
  on public.team_members for insert
  with check (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    or user_id = auth.uid() -- allow users to add themselves (for signup/invite accept)
  );

-- Team members: owner/admin can remove, or user can remove themselves
create policy "Team admins can remove members"
  on public.team_members for delete
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    or user_id = auth.uid()
  );

-- Team invites: owner/admin of team can manage
create policy "Team admins can manage invites"
  on public.team_invites for all
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Team invites: anyone can read their own invite by email (for accept flow)
create policy "Users can view their own invites"
  on public.team_invites for select
  using (true); -- Token-based access; filtered in app code

-- ============================================
-- Indexes
-- ============================================
create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_invites_token on public.team_invites(token);
create index if not exists idx_team_invites_email on public.team_invites(email);
create index if not exists idx_companies_team_id on public.companies(team_id);

-- Updated_at trigger for teams
create trigger update_teams_updated_at
  before update on public.teams
  for each row execute function update_updated_at_column();
