-- =============================================================================
-- Subjects + tutor_subjects (Supabase / PostgreSQL)
-- =============================================================================
-- Prasyarat tabel yang sudah ada:
--   - public.tutor_profiles (kolom id uuid PK, user_id uuid → public.users)
--
-- Jalankan di: Supabase Dashboard → SQL Editor → tempel seluruh skrip → Run.
--
-- Aplikasi Next.js mengharapkan:
--   - public.subjects: id, name, category, created_at (created_at dipakai urutan katalog)
--   - public.tutor_subjects: tutor_profile_id, subject_id (many-to-many)
--
-- Catatan: server Anda memakai service role (lib/supabase/server.ts) sehingga
-- melewati RLS; policy di bawah tetap berguna jika nanti ada akses lewat anon key.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabel subjects
-- -----------------------------------------------------------------------------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subjects_name_not_blank check (btrim(name) <> '')
);

comment on table public.subjects is
  'Katalog mata kuliah / skill global. Satu baris dipakai banyak tutor lewat tutor_subjects.';

comment on column public.subjects.category is
  'Kelompok / varian (mis. image compositing). Nama boleh sama antar baris jika kategori berbeda.';

drop index if exists public.subjects_name_lower_btrim_unique;

create unique index if not exists subjects_name_category_lower_unique
  on public.subjects (
    lower(btrim(name)),
    lower(btrim(coalesce(category, '')))
  );

create index if not exists subjects_created_at_idx
  on public.subjects (created_at desc);

-- -----------------------------------------------------------------------------
-- 2. updated_at otomatis (nama fungsi khusus agar tidak bentrok dengan proyek lain)
-- -----------------------------------------------------------------------------
create or replace function public.subjects_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists subjects_set_updated_at on public.subjects;
create trigger subjects_set_updated_at
  before update on public.subjects
  for each row
  execute procedure public.subjects_touch_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Junction tutor_subjects
-- -----------------------------------------------------------------------------
create table if not exists public.tutor_subjects (
  tutor_profile_id uuid not null
    references public.tutor_profiles (id) on delete cascade,
  subject_id uuid not null
    references public.subjects (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tutor_profile_id, subject_id)
);

comment on table public.tutor_subjects is
  'Mata kuliah yang diajar oleh satu profil tutor.';

create index if not exists tutor_subjects_subject_id_idx
  on public.tutor_subjects (subject_id);

-- -----------------------------------------------------------------------------
-- 4. Foreign key bookings.subject_id → subjects (jika kolom & tabel ada)
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'bookings'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'subject_id'
  ) then
    if not exists (
      select 1 from pg_constraint
      where conname = 'bookings_subject_id_fkey'
    ) then
      alter table public.bookings
        add constraint bookings_subject_id_fkey
        foreign key (subject_id) references public.subjects (id)
        on delete restrict;
    end if;
  end if;
exception
  when undefined_table then
    null;
end $$;

-- -----------------------------------------------------------------------------
-- 5. Row Level Security (opsional tapi disarankan)
-- -----------------------------------------------------------------------------
alter table public.subjects enable row level security;
alter table public.tutor_subjects enable row level security;

-- subjects: semua orang bisa baca (katalog publik)
drop policy if exists "subjects_select_all" on public.subjects;
create policy "subjects_select_all"
  on public.subjects for select
  using (true);

-- subjects: user login boleh menambah / memperbarui (mis. enrichment kategori)
drop policy if exists "subjects_insert_authenticated" on public.subjects;
create policy "subjects_insert_authenticated"
  on public.subjects for insert to authenticated
  with check (true);

drop policy if exists "subjects_update_authenticated" on public.subjects;
create policy "subjects_update_authenticated"
  on public.subjects for update to authenticated
  using (true)
  with check (true);

-- tutor_subjects: baca semua (profil publik tutor memuat daftar mapel)
drop policy if exists "tutor_subjects_select_all" on public.tutor_subjects;
create policy "tutor_subjects_select_all"
  on public.tutor_subjects for select
  using (true);

-- tutor_subjects: ubah hanya baris milik tutor (user_id = auth.uid())
drop policy if exists "tutor_subjects_insert_own" on public.tutor_subjects;
create policy "tutor_subjects_insert_own"
  on public.tutor_subjects for insert to authenticated
  with check (
    exists (
      select 1
      from public.tutor_profiles tp
      where tp.id = tutor_profile_id
        and tp.user_id = auth.uid()
    )
  );

drop policy if exists "tutor_subjects_delete_own" on public.tutor_subjects;
create policy "tutor_subjects_delete_own"
  on public.tutor_subjects for delete to authenticated
  using (
    exists (
      select 1
      from public.tutor_profiles tp
      where tp.id = tutor_profile_id
        and tp.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- 6. (Opsional) Seed awal — selaras dengan lib/data.ts (DEFAULT_TUTOR_SUBJECTS)
--     Aman dijalankan berulang (hanya menambah jika nama belum ada).
-- -----------------------------------------------------------------------------
insert into public.subjects (name, category)
select v.name, v.category
from (
  values
    -- Programming & Computer Science
    ('Algoritma dan Dasar Pemrograman', 'Programming'),
    ('Pemrograman Web', 'Programming'),
    ('Pemrograman Mobile', 'Programming'),
    ('Object Oriented Programming (OOP)', 'Programming'),
    ('Struktur Data', 'Computer Science'),
    ('Basis Data', 'Computer Science'),
    ('Pengantar Teori Komputasi', 'Computer Science'),
    ('Struktur Diskrit', 'Computer Science'),
    ('Aljabar Linier untuk Komputasi', 'Mathematics'),
    ('Rangkaian Digital', 'Computer Engineering'),
    -- Design & Creative
    ('Adobe Photoshop', 'Design & Arts'),
    ('Adobe Illustrator', 'Design & Arts'),
    ('Figma', 'UI/UX Design'),
    ('UI/UX Design', 'UI/UX Design'),
    ('Canva Design', 'Design & Arts'),
    ('Video Editing', 'Multimedia'),
    -- Mathematics
    ('Kalkulus 1', 'Mathematics'),
    ('Kalkulus 2', 'Mathematics'),
    ('Statistika', 'Mathematics'),
    ('Matematika Diskrit', 'Mathematics'),
    -- Science
    ('Biokimia Umum', 'Biology'),
    ('Fisiologi Mikrob', 'Biology'),
    ('Ekologi Mikrob dan Evolusi', 'Biology'),
    ('Mikologi dan Aplikasi', 'Biology'),
    ('Fisiologi Tumbuhan', 'Biology'),
    ('Fisika Dasar', 'Physics'),
    ('Kimia Dasar', 'Chemistry'),
    -- Business & Management
    ('Akuntansi Dasar', 'Business'),
    ('Manajemen Bisnis', 'Business'),
    ('Ekonomi Mikro', 'Economics'),
    ('Ekonomi Makro', 'Economics'),
    -- Language
    ('Bahasa Inggris Akademik', 'Language'),
    ('TOEFL Preparation', 'Language'),
    ('IELTS Preparation', 'Language'),
    ('Public Speaking', 'Communication'),
    -- School Subjects
    ('Matematika SMA', 'School Subjects'),
    ('Fisika SMA', 'School Subjects'),
    ('Kimia SMA', 'School Subjects'),
    ('Biologi SMA', 'School Subjects'),
    ('Sejarah SMA', 'School Subjects'),
    ('Geografi SMA', 'School Subjects')
) as v(name, category)
where not exists (
  select 1 from public.subjects s
  where lower(btrim(s.name)) = lower(btrim(v.name))
    and lower(btrim(coalesce(s.category, ''))) = lower(btrim(coalesce(v.category, '')))
);
