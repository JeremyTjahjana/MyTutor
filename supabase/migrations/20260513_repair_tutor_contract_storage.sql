-- Repair migration for tutor contract uploads.
-- Safe to run on databases that already have the columns/bucket.

begin;

alter table public.users
  add column if not exists contract_pdf_name text,
  add column if not exists contract_pdf_url text;

insert into storage.buckets (id, name, public)
values ('tutor-contracts', 'tutor-contracts', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists tutor_contracts_select_public on storage.objects;
create policy tutor_contracts_select_public on storage.objects
for select
using (bucket_id = 'tutor-contracts');

drop policy if exists tutor_contracts_insert_own on storage.objects;
create policy tutor_contracts_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'tutor-contracts'
  and split_part(name, '/', 1) = auth.uid()::text
);

commit;