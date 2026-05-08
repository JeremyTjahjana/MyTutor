-- Public browse access for tutor listing MVP.
-- Keeps bookings and payments restricted, but allows the marketplace listing page
-- to read tutor profiles and subject metadata without requiring login.

begin;

grant select on table public.users to anon, authenticated;
grant select on table public.tutor_profiles to anon, authenticated;
grant select on table public.subjects to anon, authenticated;
grant select on table public.tutor_subjects to anon, authenticated;
grant select on table public.schedules to anon, authenticated;
grant select on table public.testimonies to anon, authenticated;

drop policy if exists users_select_own on public.users;
create policy users_select_public on public.users
for select to anon, authenticated
using (true);

drop policy if exists tutor_profiles_select_all on public.tutor_profiles;
create policy tutor_profiles_select_public on public.tutor_profiles
for select to anon, authenticated
using (true);

drop policy if exists subjects_select_all on public.subjects;
create policy subjects_select_public on public.subjects
for select to anon, authenticated
using (true);

drop policy if exists tutor_subjects_select_all on public.tutor_subjects;
create policy tutor_subjects_select_public on public.tutor_subjects
for select to anon, authenticated
using (true);

drop policy if exists schedules_select_all on public.schedules;
create policy schedules_select_public on public.schedules
for select to anon, authenticated
using (true);

drop policy if exists testimonies_select_all on public.testimonies;
create policy testimonies_select_public on public.testimonies
for select to anon, authenticated
using (true);

commit;
