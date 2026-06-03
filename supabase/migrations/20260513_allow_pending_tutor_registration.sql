-- Allow pending tutor registrations to remain as student accounts until admin approval.

begin;

alter table public.users
  drop constraint if exists users_tutor_status_if_tutor_chk;

alter table public.users
  drop constraint if exists users_role_tutor_status_chk;

alter table public.users
  add constraint users_role_tutor_status_chk
  check (
    (role = 'student' and tutor_status is null)
    or (role = 'student' and tutor_status = 'pending')
    or (role = 'tutor' and tutor_status = 'approved')
    or (role = 'admin' and tutor_status is null)
  );

commit;