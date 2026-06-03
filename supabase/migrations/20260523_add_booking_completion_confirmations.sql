alter table public.bookings
  add column if not exists student_completed_at timestamptz,
  add column if not exists tutor_completed_at timestamptz;

update public.bookings
set
  student_completed_at = coalesce(student_completed_at, updated_at, now()),
  tutor_completed_at = coalesce(tutor_completed_at, updated_at, now())
where status = 'completed';
