create or replace function public.prevent_self_booking()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.tutor_profiles tp
    where tp.id = new.tutor_profile_id
      and tp.user_id = new.student_id
  ) then
    raise exception 'A tutor cannot book their own schedule.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_bookings_prevent_self_booking on public.bookings;
create trigger trg_bookings_prevent_self_booking
before insert or update of student_id, tutor_profile_id on public.bookings
for each row execute function public.prevent_self_booking();
