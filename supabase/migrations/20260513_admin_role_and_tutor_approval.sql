-- Allow admins to approve tutor registrations after the admin enum value exists.

begin;

alter table public.users
  drop constraint if exists users_tutor_status_if_tutor_chk;

alter table public.users
  add constraint users_role_tutor_status_chk
  check (
    (role = 'student' and tutor_status is null)
    or (role = 'tutor' and tutor_status is not null)
    or (role = 'admin' and tutor_status is null)
  );

drop policy if exists users_update_admin on public.users;
create policy users_update_admin on public.users
for update to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

commit;
