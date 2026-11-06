-- Part 1 schema. Row level security is on.
-- State and LGA names are publicly readable so the profile dropdown can load.
-- Policies for personal data are added in Part 2.

create extension if not exists pgcrypto;

create table public.ng_states (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table public.ng_lgas (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references public.ng_states(id) on delete cascade,
  name text not null,
  unique (state_id, name)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  state text not null default '',
  lga text not null default '',
  city text not null default '',
  headline text not null default '',
  career_interests text not null default '',
  nysc_status text not null default 'none' check (nysc_status in ('none','serving','completed','exempt')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  level text not null default '',
  created_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null default '',
  city text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('olevel','ond','hnd','bsc','professional')),
  exam_body text not null default '',
  school text not null default '',
  year text not null default '',
  exam_number text not null default '',
  file_path text,
  status text not null default 'pending_review' check (status in ('pending_review','confirmed')),
  created_at timestamptz not null default now()
);

create table public.certificate_subjects (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid not null references public.certificates(id) on delete cascade,
  subject text not null,
  grade text not null
);

create table public.employers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null default '',
  contact_email text not null default '',
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references public.employers(id) on delete set null,
  source text not null default 'employer' check (source in ('employer','feed','page','curated')),
  source_url text,
  dedupe_hash text,
  title text not null,
  company_name text not null default '',
  description text not null default '',
  state text not null default '',
  city text not null default '',
  work_mode text not null default 'onsite' check (work_mode in ('onsite','remote','hybrid')),
  salary_text text not null default '',
  employment_type text not null default 'full_time',
  apply_email text,
  apply_url text,
  qualification_min text not null default 'olevel' check (qualification_min in ('none','olevel','ond','hnd','bsc','professional')),
  english_credit boolean not null default false,
  maths_credit boolean not null default false,
  min_credits integer not null default 0,
  required_subjects text[] not null default '{}',
  required_skills text[] not null default '{}',
  category text not null check (category in ('olevel','profile')),
  deadline date,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.job_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text,
  enabled boolean not null default false,
  last_run_at timestamptz
);

create table public.daily_picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  pick_date date not null,
  lane text not null check (lane in ('profile','olevel')),
  rank integer not null,
  match_reason text not null default '',
  missing_skills text[] not null default '{}',
  unique (user_id, job_id),
  unique (user_id, pick_date, rank)
);

create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('resume','cv')),
  template_id text not null,
  title text not null default '',
  sections jsonb not null default '{}'::jsonb,
  pdf_path text,
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  resume_id uuid references public.resumes(id) on delete set null,
  channel text not null check (channel in ('email','external')),
  status text not null default 'draft' check (status in ('draft','sent','opened_external','replied','interview','offer','rejected')),
  subject text not null default '',
  body text not null default '',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.gmail_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  gmail_address text not null default '',
  refresh_token text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.ng_states enable row level security;
alter table public.ng_lgas enable row level security;
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_subjects enable row level security;
alter table public.employers enable row level security;
alter table public.jobs enable row level security;
alter table public.job_sources enable row level security;
alter table public.daily_picks enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;
alter table public.gmail_connections enable row level security;

create policy "Public can read states" on public.ng_states for select to anon, authenticated using (true);
create policy "Public can read lgas" on public.ng_lgas for select to anon, authenticated using (true);

grant select on public.ng_states to anon, authenticated;
grant select on public.ng_lgas to anon, authenticated;

insert into storage.buckets (id, name, public)
values
  ('certificate-slips', 'certificate-slips', false),
  ('resumes', 'resumes', false)
on conflict (id) do nothing;
