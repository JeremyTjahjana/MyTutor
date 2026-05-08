-- Public tutor listing RPC for MVP.
-- This bypasses RLS safely for the marketplace browse flow only.

begin;

create or replace function public.get_tutor_listings()
returns table (
  id uuid,
  user_id uuid,
  name text,
  bio text,
  rating numeric,
  cost_per_hour numeric,
  total_sessions integer,
  avatar_url text,
  subject_ids uuid[],
  subject_names text[]
)
language sql
stable
security definer
set search_path = public
as $$
  select
    tp.id,
    tp.user_id,
    u.full_name as name,
    coalesce(tp.bio, '') as bio,
    tp.rating,
    tp.cost_per_hour,
    tp.total_sessions,
    u.avatar_url,
    coalesce(array_agg(distinct ts.subject_id) filter (where ts.subject_id is not null), '{}'::uuid[]) as subject_ids,
    coalesce(array_agg(distinct s.name) filter (where s.name is not null), '{}'::text[]) as subject_names
  from public.tutor_profiles tp
  join public.users u on u.id = tp.user_id
  left join public.tutor_subjects ts on ts.tutor_profile_id = tp.id
  left join public.subjects s on s.id = ts.subject_id
  where u.role = 'tutor'
    and u.tutor_status = 'approved'
  group by tp.id, tp.user_id, u.full_name, tp.bio, tp.rating, tp.cost_per_hour, tp.total_sessions, u.avatar_url
  order by tp.rating desc, tp.total_sessions desc, u.full_name asc;
$$;

grant execute on function public.get_tutor_listings() to anon, authenticated;

commit;
