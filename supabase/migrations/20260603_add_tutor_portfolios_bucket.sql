begin;

insert into storage.buckets (
  id,
  name,
  public,
  allowed_mime_types,
  file_size_limit
)
values (
  'tutor-portfolios',
  'tutor-portfolios',
  true,
  array['image/jpeg', 'image/png', 'image/webp'],
  5242880
)
on conflict (id) do update
set
  public = excluded.public,
  allowed_mime_types = excluded.allowed_mime_types,
  file_size_limit = excluded.file_size_limit;

commit;
