-- Jalankan di Supabase > SQL Editor (project baru).
-- ===== Tabel konten untuk website =====

-- Tabel berita/artikel
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  image_url text,
  image_alt text,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel galeri foto
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  image_alt text,
  category text not null,
  album text not null,
  published boolean not null default false,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel dokumentasi/resources
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_type text not null,
  file_size integer,
  category text not null,
  version text,
  published boolean not null default false,
  featured boolean not null default false,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel thumbnail/menyimpan data website
create table if not exists public.thumbnails (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  image_url text not null,
  alt_text text,
  width integer,
  height integer,
  is_feature boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel setting website
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  value_json jsonb,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

-- ===== Index =====
create index if not exists idx_news_published on public.news(published, published_at desc);
create index if not exists idx_news_slug on public.news(slug);
create index if not exists idx_photos_published on public.photos(published, order_index);
create index if not exists idx_photos_album on public.photos(album);
create index if not exists idx_documents_published on public.documents(published, featured);
create index if not exists idx_thumbnails_section on public.thumbnails(section);

-- ===== Triggers =====
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create trigger set_photos_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create trigger set_thumbnails_updated_at
before update on public.thumbnails
for each row execute function public.set_updated_at();

create trigger set_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- ===== Row Level Security (RLS) =====

-- Berita: publik bisa baca yang terpublish, admin bisa kelola semuanya
alter table public.news enable row level security;
create policy "news_public_read" on public.news for select to anon,authenticated using (published = true);
create policy "news_admin_all" on public.news for all to authenticated using (public.is_admin());

-- Foto: sama seperti berita
alter table public.photos enable row level security;
create policy "photos_public_read" on public.photos for select to anon,authenticated using (published = true);
create policy "photos_admin_all" on public.photos for all to authenticated using (public.is_admin());

-- Dokumentasi: sama seperti berita
alter table public.documents enable row level security;
create policy "documents_public_read" on public.documents for select to anon,authenticated using (published = true);
create policy "documents_admin_all" on public.documents for all to authenticated using (public.is_admin());

-- Thumbnail: admin saja bisa kelola, mungkin publik butuh baca
alter table public.thumbnails enable row level security;
create policy "thumbnails_admin_all" on public.thumbnails for all to authenticated using (public.is_admin());

-- Settings: admin saja bisa kelola
alter table public.settings enable row level security;
create policy "settings_admin_all" on public.settings for all to authenticated using (public.is_admin());

-- ===== Fungsi helper =====

create or replace function public.get_news_list()
returns setof public.news
language sql
stable
as $$
select * from public.news
where published = true
order by published_at desc nulls last, created_at desc;
$$
revoke execute on function public.get_news_list from public;
grant execute on function public.get_news_list to anon, authenticated;

create or replace function public.get_photos_list()
returns table(
  id uuid,
  title text,
  description text,
  image_url text,
  image_alt text,
  category text,
  album text,
  published boolean,
  featured boolean,
  order_index integer,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
as $$
select * from public.photos
where published = true
order by order_index asc, created_at desc;
$$
revoke execute on function public.get_photos_list from public;
grant execute on function public.get_photos_list to anon, authenticated;

create or replace function public.get_documents_list()
returns setof public.documents
language sql
stable
as $$
select * from public.documents
where published = true
order by featured desc, created_at desc;
$$
revoke execute on function public.get_documents_list from public;
grant execute on function public.get_documents_list to anon, authenticated;