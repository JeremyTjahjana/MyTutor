begin;

alter table public.bookings
  add column if not exists student_count integer not null default 1
    check (student_count > 0),
  add column if not exists session_count integer not null default 1
    check (session_count > 0);

create or replace function public.sync_tutor_profile_booking_stats(
  p_tutor_profile_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tutor_profiles tp
  set
    total_sessions = stats.total_sessions,
    total_earnings = stats.total_earnings
  from (
    select
      tp_source.id,
      coalesce(sum(coalesce(b.session_count, 1)), 0)::integer as total_sessions,
      coalesce(
        sum(
          coalesce(
            p.amount,
            tp_source.cost_per_hour
              * coalesce(b.student_count, 1)
              * coalesce(b.session_count, 1)
          )
        ),
        0
      )::numeric(12, 2) as total_earnings
    from public.tutor_profiles tp_source
    left join public.bookings b
      on b.tutor_profile_id = tp_source.id
      and b.status = 'completed'
    left join public.payments p
      on p.booking_id = b.id
      and p.status = 'completed'
    where tp_source.id = p_tutor_profile_id
    group by tp_source.id
  ) stats
  where tp.id = stats.id;
end;
$$;

create or replace function public.refresh_tutor_profile_stats_from_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tutor_profile_id uuid;
begin
  if tg_op = 'DELETE' then
    tutor_profile_id := old.tutor_profile_id;
  else
    tutor_profile_id := new.tutor_profile_id;
  end if;

  perform public.sync_tutor_profile_booking_stats(tutor_profile_id);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_refresh_tutor_profile_stats_from_booking
  on public.bookings;
create trigger trg_refresh_tutor_profile_stats_from_booking
after insert or update of status, student_count, session_count or delete
on public.bookings
for each row execute function public.refresh_tutor_profile_stats_from_booking();

create or replace function public.refresh_tutor_profile_stats_from_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tutor_profile_id uuid;
  booking_id uuid;
begin
  if tg_op = 'DELETE' then
    booking_id := old.booking_id;
  else
    booking_id := new.booking_id;
  end if;

  select b.tutor_profile_id
  into tutor_profile_id
  from public.bookings b
  where b.id = booking_id;

  if tutor_profile_id is not null then
    perform public.sync_tutor_profile_booking_stats(tutor_profile_id);
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_refresh_tutor_profile_stats_from_payment
  on public.payments;
create trigger trg_refresh_tutor_profile_stats_from_payment
after insert or update of amount, status or delete
on public.payments
for each row execute function public.refresh_tutor_profile_stats_from_payment();

select public.sync_tutor_profile_booking_stats(id)
from public.tutor_profiles;

commit;
