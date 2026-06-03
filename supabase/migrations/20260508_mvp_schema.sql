-- MVP schema for MyTutor
-- Creates tables, relations, constraints, indexes, and basic RLS policies.

begin;

-- Extensions
create extension if not exists pgcrypto;

-- Enums
create type public.user_role as enum ('student', 'tutor');
create type public.tutor_status as enum ('pending', 'approved', 'rejected');
create type public.booking_status as enum ('pending', 'accepted', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'completed', 'failed');

-- Timestamp helper trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- USERS
-- Linked 1:1 to auth.users so Supabase Auth can be used directly.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  role public.user_role not null default 'student',
  tutor_status public.tutor_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_tutor_status_if_tutor_chk check (
    (role = 'tutor' and tutor_status is not null)
    or
    (role = 'student' and tutor_status is null)
  )
);

create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- Keep public.users synchronized with Supabase Auth users.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    -- Avoid blocking auth signup due to profile errors.
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- TUTOR PROFILES (users 1 -> 1 tutor_profiles)
create table public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  bio text,
  experience text,
  cost_per_hour numeric(12,2) not null default 0 check (cost_per_hour >= 0),
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  total_sessions integer not null default 0 check (total_sessions >= 0),
  total_earnings numeric(12,2) not null default 0 check (total_earnings >= 0),
  portfolio_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_tutor_profiles_updated_at
before update on public.tutor_profiles
for each row execute function public.set_updated_at();

-- SUBJECTS
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamptz not null default now()
);

-- TUTOR SUBJECTS (many-to-many)
create table public.tutor_subjects (
  tutor_profile_id uuid not null references public.tutor_profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tutor_profile_id, subject_id)
);

-- SCHEDULES
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  tutor_profile_id uuid not null references public.tutor_profiles(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedules_time_range_chk check (start_time < end_time)
);

create trigger trg_schedules_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

-- BOOKINGS
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete restrict,
  tutor_profile_id uuid not null references public.tutor_profiles(id) on delete restrict,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status public.booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_time_range_chk check (start_time < end_time)
);

create trigger trg_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- TESTIMONIES (bookings 1 -> 1 testimonies)
create table public.testimonies (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  tutor_profile_id uuid not null references public.tutor_profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  message text,
  created_at timestamptz not null default now()
);

-- PAYMENTS (bookings 1 -> 1 payments)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  status public.payment_status not null default 'pending',
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- Useful indexes
create index idx_users_role on public.users(role);
create index idx_tutor_profiles_user_id on public.tutor_profiles(user_id);
create index idx_tutor_subjects_subject_id on public.tutor_subjects(subject_id);
create index idx_schedules_tutor_profile_id on public.schedules(tutor_profile_id);
create index idx_bookings_student_id on public.bookings(student_id);
create index idx_bookings_tutor_profile_id on public.bookings(tutor_profile_id);
create index idx_bookings_subject_id on public.bookings(subject_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_start_time on public.bookings(start_time);
create index idx_testimonies_tutor_profile_id on public.testimonies(tutor_profile_id);

-- RLS
alter table public.users enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.tutor_subjects enable row level security;
alter table public.schedules enable row level security;
alter table public.bookings enable row level security;
alter table public.testimonies enable row level security;
alter table public.payments enable row level security;

-- Users policies
create policy users_select_own on public.users
for select to authenticated
using (auth.uid() = id);

create policy users_update_own on public.users
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy users_insert_own on public.users
for insert to authenticated
with check (auth.uid() = id);

-- Tutor profile policies
create policy tutor_profiles_select_all on public.tutor_profiles
for select to authenticated
using (true);

create policy tutor_profiles_insert_own on public.tutor_profiles
for insert to authenticated
with check (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid() and u.id = user_id and u.role = 'tutor'
  )
);

create policy tutor_profiles_update_own on public.tutor_profiles
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Subjects/tutor_subjects/schedules read policies
create policy subjects_select_all on public.subjects
for select to authenticated
using (true);

create policy tutor_subjects_select_all on public.tutor_subjects
for select to authenticated
using (true);

create policy schedules_select_all on public.schedules
for select to authenticated
using (true);

-- Tutor can manage their own schedule/subjects
create policy schedules_insert_own on public.schedules
for insert to authenticated
with check (
  exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

create policy schedules_update_own on public.schedules
for update to authenticated
using (
  exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

create policy tutor_subjects_insert_own on public.tutor_subjects
for insert to authenticated
with check (
  exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

create policy tutor_subjects_delete_own on public.tutor_subjects
for delete to authenticated
using (
  exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

-- Booking policies
create policy bookings_select_related on public.bookings
for select to authenticated
using (
  student_id = auth.uid()
  or exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

create policy bookings_insert_student on public.bookings
for insert to authenticated
with check (
  student_id = auth.uid()
  and exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'student'
  )
);

create policy bookings_update_related on public.bookings
for update to authenticated
using (
  student_id = auth.uid()
  or exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
)
with check (
  student_id = auth.uid()
  or exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = tutor_profile_id and tp.user_id = auth.uid()
  )
);

-- Testimonies policies
create policy testimonies_select_all on public.testimonies
for select to authenticated
using (true);

create policy testimonies_insert_student on public.testimonies
for insert to authenticated
with check (student_id = auth.uid());

-- Payments policies
create policy payments_select_related on public.payments
for select to authenticated
using (
  exists (
    select 1
    from public.bookings b
    left join public.tutor_profiles tp on tp.id = b.tutor_profile_id
    where b.id = booking_id
      and (
        b.student_id = auth.uid()
        or tp.user_id = auth.uid()
      )
  )
);

create policy payments_insert_related on public.payments
for insert to authenticated
with check (
  exists (
    select 1
    from public.bookings b
    where b.id = booking_id and b.student_id = auth.uid()
  )
);

-- Optional seed data for MVP subjects
insert into public.subjects (name, category)
values
  ('Matematika', 'STEM'),
  ('Fisika', 'STEM'),
  ('Kimia', 'STEM'),
  ('Biologi', 'STEM'),
  ('Bahasa Inggris', 'Language')
on conflict (name) do nothing;

commit;
