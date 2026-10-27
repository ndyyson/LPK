-- Jalankan di Supabase > SQL Editor (project baru).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role) values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null unique,
  full_name text not null check (char_length(full_name) between 3 and 150),
  whatsapp text not null check (whatsapp ~ '^[+0-9()\-\s]{8,20}$'),
  email text check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  birth_place text not null check (char_length(birth_place) between 1 and 100),
  birth_date date not null check (birth_date between '1900-01-01' and current_date),
  gender text check (gender is null or gender in ('Laki-laki','Perempuan','Tidak ingin menyebutkan')),
  address text not null check (char_length(address) between 1 and 500),
  education text not null check (education in ('SD','SMP','SMA/SMK','Diploma','S1','S2 atau lebih','Lainnya')),
  program_slug text not null check (program_slug in ('housekeeper','caregiver','bahasa-jepang','bahasa-korea')),
  country_slug text check (country_slug is null or country_slug in ('hong-kong','singapura','brunei-darussalam','malaysia','taiwan','korea-selatan')),
  work_experience text check (work_experience is null or char_length(work_experience) <= 1000),
  notes text check (notes is null or char_length(notes) <= 1000),
  consent_at timestamptz not null default now(),
  status text not null default 'Menunggu Verifikasi' check (status in ('Menunggu Verifikasi','Sedang Diproses','Diterima','Ditolak','Selesai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.registrations (status, created_at desc);
create index on public.registrations (program_slug, created_at desc);

create function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger registrations_updated before update on public.registrations for each row execute function public.set_updated_at();

-- ===== Hak akses =====
alter table public.profiles enable row level security;
alter table public.registrations enable row level security;

create policy "profil sendiri atau admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
-- profiles: tanpa policy tulis. Role admin hanya diberikan lewat SQL Editor.

-- Pengunjung TIDAK bisa insert/select langsung. Hanya lewat fungsi submit_registration di bawah.
revoke all on public.registrations from anon, authenticated;
grant select on public.registrations to authenticated;
grant update (status) on public.registrations to authenticated;
create policy "admin baca pendaftar" on public.registrations for select to authenticated using (public.is_admin());
create policy "admin ubah status" on public.registrations for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Tidak ada policy delete: data tidak dapat dihapus dari aplikasi.

-- ===== Pengiriman pendaftaran publik (divalidasi ulang di server) =====
create function public.submit_registration(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare v_num text;
begin
  if coalesce((p->>'consent')::boolean, false) is not true then
    raise exception 'Data tidak valid: persetujuan privasi diperlukan.' using errcode = '22023';
  end if;
  v_num := 'REG-' || to_char(now() at time zone 'Asia/Jakarta', 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  begin
    insert into public.registrations (registration_number, full_name, whatsapp, email, birth_place, birth_date, gender, address, education, program_slug, country_slug, work_experience, notes)
    values (v_num, btrim(p->>'full_name'), btrim(p->>'whatsapp'), nullif(btrim(p->>'email'), ''), btrim(p->>'birth_place'), (p->>'birth_date')::date,
            nullif(p->>'gender', ''), btrim(p->>'address'), p->>'education', p->>'program_slug', nullif(p->>'country_slug', ''),
            nullif(btrim(p->>'work_experience'), ''), nullif(btrim(p->>'notes'), ''));
  exception when check_violation or not_null_violation or invalid_text_representation or datetime_field_overflow or invalid_datetime_format then
    raise exception 'Data tidak valid: periksa kembali isian formulir.' using errcode = '22023';
  end;
  return v_num;
end $$;
revoke all on function public.submit_registration(jsonb) from public;
grant execute on function public.submit_registration(jsonb) to anon, authenticated;
