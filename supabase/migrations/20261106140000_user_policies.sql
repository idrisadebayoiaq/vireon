-- Part 2: account policies, preference columns, and the curated starter roles.

alter table public.profiles
  add column if not exists job_alerts boolean not null default true,
  add column if not exists show_olevel_lane boolean not null default true;

create unique index if not exists employers_owner_unique on public.employers (owner_id);

alter table public.jobs drop constraint if exists jobs_dedupe_hash_key;
alter table public.jobs add constraint jobs_dedupe_hash_key unique (dedupe_hash);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on public.profiles from anon;
revoke all on public.skills from anon;
revoke all on public.experiences from anon;
revoke all on public.certificates from anon;
revoke all on public.certificate_subjects from anon;
revoke all on public.employers from anon;
revoke all on public.jobs from anon;
revoke all on public.job_sources from anon;
revoke all on public.daily_picks from anon;
revoke all on public.resumes from anon;
revoke all on public.applications from anon;
revoke all on public.gmail_connections from anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.skills to authenticated;
grant select, insert, update, delete on public.experiences to authenticated;
grant select, insert, update, delete on public.certificates to authenticated;
grant select, insert, update, delete on public.certificate_subjects to authenticated;
grant select, insert, update, delete on public.employers to authenticated;
grant select, insert, update on public.jobs to authenticated;
grant select, insert, update, delete on public.resumes to authenticated;
grant select, insert, update, delete on public.applications to authenticated;
grant select on public.daily_picks to authenticated;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Users manage own skills" on public.skills;
create policy "Users manage own skills" on public.skills
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage own experience" on public.experiences;
create policy "Users manage own experience" on public.experiences
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage own certificates" on public.certificates;
create policy "Users manage own certificates" on public.certificates
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage own subjects" on public.certificate_subjects;
create policy "Users manage own subjects" on public.certificate_subjects
  for all to authenticated
  using (
    exists (
      select 1 from public.certificates
      where certificates.id = certificate_subjects.certificate_id
        and certificates.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.certificates
      where certificates.id = certificate_subjects.certificate_id
        and certificates.user_id = auth.uid()
    )
  );

drop policy if exists "Users manage own employer" on public.employers;
create policy "Users manage own employer" on public.employers
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Seekers read active jobs" on public.jobs;
create policy "Seekers read active jobs" on public.jobs
  for select to authenticated
  using (is_active = true);

drop policy if exists "Employers insert own jobs" on public.jobs;
create policy "Employers insert own jobs" on public.jobs
  for insert to authenticated
  with check (
    employer_id in (select id from public.employers where owner_id = auth.uid())
  );

drop policy if exists "Employers update own jobs" on public.jobs;
create policy "Employers update own jobs" on public.jobs
  for update to authenticated
  using (
    employer_id in (select id from public.employers where owner_id = auth.uid())
  )
  with check (
    employer_id in (select id from public.employers where owner_id = auth.uid())
  );

drop policy if exists "Users read own picks" on public.daily_picks;
create policy "Users read own picks" on public.daily_picks
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users manage own resumes" on public.resumes;
create policy "Users manage own resumes" on public.resumes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage own applications" on public.applications;
create policy "Users manage own applications" on public.applications
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage own slips" on storage.objects;
create policy "Users manage own slips" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'certificate-slips'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'certificate-slips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users manage own resume files" on storage.objects;
create policy "Users manage own resume files" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
