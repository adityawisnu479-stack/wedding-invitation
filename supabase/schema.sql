-- ============================================================
-- Undangan Pernikahan — skema Supabase
-- Jalankan seluruh file ini di Supabase SQL Editor (sekali).
-- Setiap perubahan policy/tabel WAJIB memperbarui file ini.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- TABEL
-- ------------------------------------------------------------

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,
  active_template text not null default 'modern-minimalist'
    check (active_template in ('modern-minimalist', 'classic-luxury')),
  show_love_story boolean not null default true,
  show_gallery boolean not null default true,
  show_gift boolean not null default true,
  active_music_url text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null,
  category text not null default 'Reguler',
  phone text,
  is_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps_and_wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_name text not null,
  attendance text not null default 'hadir'
    check (attendance in ('hadir', 'tidak_hadir', 'masih_ragu')),
  pax integer not null default 1 check (pax between 0 and 50),
  message text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists invitations_user_id_idx on public.invitations (user_id);
create index if not exists guests_invitation_id_idx on public.guests (invitation_id);
create index if not exists wishes_invitation_id_idx on public.rsvps_and_wishes (invitation_id, created_at desc);

-- ------------------------------------------------------------
-- updated_at otomatis
-- ------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists invitations_touch_updated_at on public.invitations;
create trigger invitations_touch_updated_at
  before update on public.invitations
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.invitations enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps_and_wishes enable row level security;

-- Tamu boleh membaca undangan (halaman publik), pemilik mengelola miliknya.
drop policy if exists "invitations public read" on public.invitations;
create policy "invitations public read"
  on public.invitations for select
  using (true);

drop policy if exists "invitations owner insert" on public.invitations;
create policy "invitations owner insert"
  on public.invitations for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "invitations owner update" on public.invitations;
create policy "invitations owner update"
  on public.invitations for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "invitations owner delete" on public.invitations;
create policy "invitations owner delete"
  on public.invitations for delete to authenticated
  using (auth.uid() = user_id);

-- Daftar tamu: hanya pemilik undangan.
drop policy if exists "guests owner all" on public.guests;
create policy "guests owner all"
  on public.guests for all to authenticated
  using (exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id and i.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id and i.user_id = auth.uid()
  ));

-- Ucapan: tamu boleh kirim & baca yang tidak disembunyikan, pemilik mengelola semua.
drop policy if exists "wishes public read" on public.rsvps_and_wishes;
create policy "wishes public read"
  on public.rsvps_and_wishes for select
  using (is_hidden = false);

drop policy if exists "wishes public insert" on public.rsvps_and_wishes;
create policy "wishes public insert"
  on public.rsvps_and_wishes for insert
  with check (is_hidden = false);

drop policy if exists "wishes owner read all" on public.rsvps_and_wishes;
create policy "wishes owner read all"
  on public.rsvps_and_wishes for select to authenticated
  using (exists (
    select 1 from public.invitations i
    where i.id = rsvps_and_wishes.invitation_id and i.user_id = auth.uid()
  ));

drop policy if exists "wishes owner update" on public.rsvps_and_wishes;
create policy "wishes owner update"
  on public.rsvps_and_wishes for update to authenticated
  using (exists (
    select 1 from public.invitations i
    where i.id = rsvps_and_wishes.invitation_id and i.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.invitations i
    where i.id = rsvps_and_wishes.invitation_id and i.user_id = auth.uid()
  ));

drop policy if exists "wishes owner delete" on public.rsvps_and_wishes;
create policy "wishes owner delete"
  on public.rsvps_and_wishes for delete to authenticated
  using (exists (
    select 1 from public.invitations i
    where i.id = rsvps_and_wishes.invitation_id and i.user_id = auth.uid()
  ));

-- ------------------------------------------------------------
-- STORAGE (foto & musik)
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('wedding-photos', 'wedding-photos', true),
  ('wedding-music', 'wedding-music', true)
on conflict (id) do update set public = true;

drop policy if exists "wedding media public read" on storage.objects;
create policy "wedding media public read"
  on storage.objects for select
  using (bucket_id in ('wedding-photos', 'wedding-music'));

drop policy if exists "wedding media auth insert" on storage.objects;
create policy "wedding media auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('wedding-photos', 'wedding-music'));

drop policy if exists "wedding media auth update" on storage.objects;
create policy "wedding media auth update"
  on storage.objects for update to authenticated
  using (bucket_id in ('wedding-photos', 'wedding-music'));

drop policy if exists "wedding media auth delete" on storage.objects;
create policy "wedding media auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('wedding-photos', 'wedding-music'));

-- ------------------------------------------------------------
-- SEED (opsional)
-- Buat user admin dulu di Authentication > Users, lalu jalankan ini
-- dengan email admin agar undangan pertama langsung terbuat.
-- Alternatif: klik "Buat undangan" di dashboard setelah login.
-- ------------------------------------------------------------
-- insert into public.invitations (user_id, slug, content)
-- select id, 'default', '{}'::jsonb from auth.users where email = 'email-kamu@contoh.com'
-- on conflict (slug) do nothing;
