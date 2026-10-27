-- Jalankan SETELAH membuat user di Supabase > Authentication > Users. Ganti emailnya.
update public.profiles set role = 'admin', full_name = 'Administrator LPK'
where id = (select id from auth.users where email = 'GANTI-DENGAN-EMAIL-ADMIN@contoh.com');
