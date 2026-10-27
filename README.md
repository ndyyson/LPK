# Website LPK Bulan Berkah Senyum & PT. Mardel Mitra Sejahtera (React + Supabase)

Tampilan dan konten sama seperti proyek sebelumnya, tetapi **tanpa Laravel/PHP/MySQL**. Backend digantikan Supabase (PostgreSQL + Auth). Hosting: Cloudflare Pages.

> **Status jujur:** kode belum dijalankan (belum `npm install` / `npm run build`) dan SQL belum diuji di Supabase. Ikuti langkah di bawah lalu laporkan error bila ada.

## Perbedaan dari versi Laravel
| Sebelumnya | Sekarang |
|---|---|
| `POST /api/registrations` | fungsi database `submit_registration` (divalidasi ulang di server) |
| Login Sanctum + token | Supabase Auth, sesi dikelola `supabase-js` |
| Role di tabel `users` | tabel `profiles` (role `admin`), RLS |
| Ekspor CSV dari server | ekspor CSV di browser (aman dari injeksi rumus Excel) |
| Tabel programs/negara di MySQL | tetap di `src/utils/content.js`; slug dibatasi constraint di database |

## 1. Menjalankan lokal
```
npm install
copy .env.example .env      (Mac/Linux: cp .env.example .env)
npm run dev
```
Buka http://localhost:5173.

## 2. Menyiapkan Supabase
1. Buat project di supabase.com.
2. SQL Editor: jalankan `supabase/migrations/001_registrations_auth.sql`.
3. Project Settings > API: salin *Project URL* dan *anon public key* ke `.env`. Jangan pakai service_role key.
4. Authentication > Providers > Email: **matikan "Allow new users to sign up"**.

## 3. Admin pertama
1. Authentication > Users > Add user (email + kata sandi kuat, auto-confirm).
2. Edit email di `supabase/migrations/002_make_first_admin.sql`, jalankan di SQL Editor.
3. Buka `/admin` dan masuk. Tidak ada kredensial bawaan.

## 4. Deploy ke Cloudflare Pages
1. Push ke GitHub (`.env` sudah di-ignore).
2. Cloudflare > Workers & Pages > Create > Pages > Connect to Git.
3. Build command `npm run build`, output directory `dist`.
4. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
5. Supabase > Authentication > URL Configuration: isi Site URL dengan domain Anda.
`public/_redirects` mencegah 404 saat URL dibuka langsung.

## Keamanan data pendaftar
- Pengunjung tidak bisa membaca atau menulis tabel langsung; hanya lewat `submit_registration`.
- Hanya admin yang bisa membaca pendaftar dan mengubah **kolom status saja**. Tidak ada hak hapus.
- **Belum ada** pembatasan spam/rate limit. Disarankan menambah Cloudflare Turnstile sebelum publikasi.
- Formulir menyimpan data pribadi: tinjau Kebijakan Privasi, masa retensi, dan aktifkan backup Supabase.
- Gambar program/negara memakai tautan Unsplash seperti versi sebelumnya; ganti dengan aset yang Anda miliki izinnya.
