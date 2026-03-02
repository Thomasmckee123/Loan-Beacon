-- LoanBeacon Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- COMPANIES TABLE
-- ============================================
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  industry text not null,
  location text not null,
  revenue numeric not null default 0,
  employees integer not null default 0,
  website text default '',
  contact_name text not null,
  contact_title text not null,
  contact_email text not null,
  contact_phone text not null,
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- LOANS TABLE
-- ============================================
create table public.loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  type text not null,
  amount numeric not null,
  currency text not null default 'USD',
  lender text not null,
  origination_date date not null,
  maturity_date date not null,
  interest_rate numeric not null,
  covenants text default '',
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- ALERTS TABLE
-- ============================================
create table public.alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  loan_id uuid references public.loans(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  type text not null check (type in ('Maturity Warning', 'Covenant Breach', 'Rate Review')),
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Critical')),
  message text not null,
  days_until_maturity integer not null,
  dismissed boolean default false,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only see/modify their own data
-- ============================================

-- Enable RLS on all tables
alter table public.companies enable row level security;
alter table public.loans enable row level security;
alter table public.alerts enable row level security;

-- Companies policies
create policy "Users can view their own companies"
  on public.companies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own companies"
  on public.companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own companies"
  on public.companies for update
  using (auth.uid() = user_id);

create policy "Users can delete their own companies"
  on public.companies for delete
  using (auth.uid() = user_id);

-- Loans policies
create policy "Users can view their own loans"
  on public.loans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own loans"
  on public.loans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own loans"
  on public.loans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own loans"
  on public.loans for delete
  using (auth.uid() = user_id);

-- Alerts policies
create policy "Users can view their own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on public.alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.alerts for delete
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================
create index idx_companies_user_id on public.companies(user_id);
create index idx_loans_user_id on public.loans(user_id);
create index idx_loans_company_id on public.loans(company_id);
create index idx_loans_maturity_date on public.loans(maturity_date);
create index idx_alerts_user_id on public.alerts(user_id);
create index idx_alerts_dismissed on public.alerts(dismissed);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_companies_updated_at
  before update on public.companies
  for each row execute function update_updated_at_column();

create trigger update_loans_updated_at
  before update on public.loans
  for each row execute function update_updated_at_column();
