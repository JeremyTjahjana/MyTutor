-- Dummy seed data for MyTutor MVP
-- Run this AFTER the schema migration.
-- This script creates connected sample data for auth.users, public.users, tutors, subjects, schedules, bookings, testimonies, and payments.

begin;

-- pgcrypto is needed for gen_random_uuid() / crypt().
create extension if not exists pgcrypto;

-- Clear sample data in dependency order.
delete from public.payments;
delete from public.testimonies;
delete from public.bookings;
delete from public.schedules;
delete from public.tutor_subjects;
delete from public.tutor_profiles;
delete from public.users;
delete from auth.identities;
delete from auth.users;
delete from public.subjects;

-- Seed subjects first so tutor_subjects and bookings can reference them.
insert into public.subjects (id, name, category) values
  ('11111111-1111-1111-1111-111111111111', 'Matematika', 'STEM'),
  ('22222222-2222-2222-2222-222222222222', 'Fisika', 'STEM'),
  ('33333333-3333-3333-3333-333333333333', 'Kimia', 'STEM'),
  ('44444444-4444-4444-4444-444444444444', 'Biologi', 'STEM'),
  ('55555555-5555-5555-5555-555555555555', 'Bahasa Inggris', 'Language')
on conflict (id) do nothing;

-- Seed auth.users so FK to public.users remains valid.
-- Password for all dummy accounts: Password123!
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_super_admin
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student1@mytutor.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    now(),
    null,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Andi Pratama', 'role', 'student'),
    now(),
    now(),
    false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student2@mytutor.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    now(),
    null,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Nabila Sari', 'role', 'student'),
    now(),
    now(),
    false
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tutor1@mytutor.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    now(),
    null,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Budi Santoso', 'role', 'tutor'),
    now(),
    now(),
    false
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tutor2@mytutor.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    now(),
    null,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sinta Maharani', 'role', 'tutor'),
    now(),
    now(),
    false
  )
on conflict (id) do nothing;

-- Seed auth.identities for completeness.
insert into auth.identities (
  id,
  user_id,
  provider,
  identity_data,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    gen_random_uuid(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'email',
    jsonb_build_object('sub', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', 'student1@mytutor.test'),
    'student1@mytutor.test',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'email',
    jsonb_build_object('sub', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'email', 'student2@mytutor.test'),
    'student2@mytutor.test',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'email',
    jsonb_build_object('sub', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'email', 'tutor1@mytutor.test'),
    'tutor1@mytutor.test',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'email',
    jsonb_build_object('sub', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'email', 'tutor2@mytutor.test'),
    'tutor2@mytutor.test',
    now(),
    now(),
    now()
  )
on conflict do nothing;

-- Public users will also be auto-created by your trigger, but we insert explicitly
-- so the seed is deterministic even if the trigger behavior changes.
insert into public.users (
  id,
  full_name,
  email,
  phone,
  avatar_url,
  role,
  tutor_status,
  created_at,
  updated_at
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Andi Pratama', 'student1@mytutor.test', '081234567801', null, 'student', null, now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nabila Sari', 'student2@mytutor.test', '081234567802', null, 'student', null, now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Budi Santoso', 'tutor1@mytutor.test', '081234567803', null, 'tutor', 'approved', now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sinta Maharani', 'tutor2@mytutor.test', '081234567804', null, 'tutor', 'approved', now(), now())
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  avatar_url = excluded.avatar_url,
  role = excluded.role,
  tutor_status = excluded.tutor_status,
  updated_at = now();

-- Tutor profiles.
insert into public.tutor_profiles (
  id,
  user_id,
  bio,
  experience,
  cost_per_hour,
  rating,
  total_sessions,
  total_earnings,
  portfolio_urls,
  created_at,
  updated_at
)
values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Tutor matematika dan fisika untuk mahasiswa IPB dengan fokus pembahasan konsep dan latihan soal.',
    '4 tahun mengajar dan mentoring kelas kecil.',
    75000,
    4.90,
    28,
    2100000,
    jsonb_build_array('https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
    now(),
    now()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Tutor kimia dan biologi dengan pendekatan praktis untuk persiapan ujian dan tugas.',
    '3 tahun membimbing siswa dan mahasiswa.',
    70000,
    4.80,
    21,
    1470000,
    jsonb_build_array('https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
    now(),
    now()
  )
on conflict (user_id) do update
set
  bio = excluded.bio,
  experience = excluded.experience,
  cost_per_hour = excluded.cost_per_hour,
  rating = excluded.rating,
  total_sessions = excluded.total_sessions,
  total_earnings = excluded.total_earnings,
  portfolio_urls = excluded.portfolio_urls,
  updated_at = now();

-- Tutor subjects.
insert into public.tutor_subjects (tutor_profile_id, subject_id)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444')
on conflict do nothing;

-- Schedules.
insert into public.schedules (
  id,
  tutor_profile_id,
  day_of_week,
  start_time,
  end_time,
  is_available,
  created_at,
  updated_at
)
values
  ('11111111-2222-3333-4444-555555555551', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1, '09:00', '11:00', true, now(), now()),
  ('11111111-2222-3333-4444-555555555552', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 3, '13:00', '16:00', true, now(), now()),
  ('11111111-2222-3333-4444-555555555553', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 2, '10:00', '12:00', true, now(), now()),
  ('11111111-2222-3333-4444-555555555554', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 5, '14:00', '17:00', true, now(), now())
on conflict (id) do nothing;

-- Bookings.
insert into public.bookings (
  id,
  student_id,
  tutor_profile_id,
  subject_id,
  start_time,
  end_time,
  status,
  notes,
  created_at,
  updated_at
)
values
  (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    '2026-03-06 12:00:00+00',
    '2026-03-06 13:00:00+00',
    'completed',
    'Bahas konsep limit dan turunan.',
    now() - interval '14 days',
    now() - interval '14 days'
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    '2026-03-07 14:00:00+00',
    '2026-03-07 15:00:00+00',
    'completed',
    'Latihan soal mekanika dasar.',
    now() - interval '13 days',
    now() - interval '13 days'
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-000000000003',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '33333333-3333-3333-3333-333333333333',
    '2026-03-08 16:00:00+00',
    '2026-03-08 17:00:00+00',
    'pending',
    'Persiapan ujian kimia organik.',
    now() - interval '12 days',
    now() - interval '12 days'
  )
on conflict (id) do nothing;

-- Payments for completed/active bookings.
insert into public.payments (
  id,
  booking_id,
  amount,
  status,
  payment_method,
  created_at,
  updated_at
)
values
  (
    '99999999-9999-9999-9999-999999999991',
    'aaaaaaaa-bbbb-cccc-dddd-000000000001',
    75000,
    'completed',
    'qris',
    now() - interval '14 days',
    now() - interval '14 days'
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    'aaaaaaaa-bbbb-cccc-dddd-000000000002',
    75000,
    'completed',
    'transfer',
    now() - interval '13 days',
    now() - interval '13 days'
  ),
  (
    '99999999-9999-9999-9999-999999999993',
    'aaaaaaaa-bbbb-cccc-dddd-000000000003',
    70000,
    'pending',
    'e-wallet',
    now() - interval '12 days',
    now() - interval '12 days'
  )
on conflict (id) do nothing;

-- Testimonies only for completed bookings.
insert into public.testimonies (
  id,
  booking_id,
  student_id,
  tutor_profile_id,
  rating,
  message,
  created_at
)
values
  (
    '88888888-8888-8888-8888-888888888881',
    'aaaaaaaa-bbbb-cccc-dddd-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    5,
    'Penjelasan tutor sangat jelas dan rapi. Mudah dipahami.',
    now() - interval '13 days'
  ),
  (
    '88888888-8888-8888-8888-888888888882',
    'aaaaaaaa-bbbb-cccc-dddd-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    5,
    'Tutor sangat sabar dan membantu sampai paham.',
    now() - interval '12 days'
  )
on conflict (booking_id) do nothing;

commit;
