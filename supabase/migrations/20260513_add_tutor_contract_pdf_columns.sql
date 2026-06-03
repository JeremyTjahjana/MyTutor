-- Store the uploaded tutor contract PDF metadata on public.users.

begin;

alter table public.users
  add column if not exists contract_pdf_name text,
  add column if not exists contract_pdf_url text;

commit;
