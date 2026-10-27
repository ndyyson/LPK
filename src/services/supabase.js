import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key);
// Hanya anon key (publik). Keamanan data dijaga RLS + fungsi di database.
export const supabase = createClient(url || 'http://localhost:54321', key || 'placeholder-anon-key');
export const PAGE_SIZE = 25;

function need() { if (!configured) throw new Error('Supabase belum dikonfigurasi. Isi file .env (lihat .env.example).'); }
const fail = (e) => { throw new Error(e.message || 'Terjadi kesalahan.'); };

export async function submitRegistration(f) {
  need();
  const payload = {
    full_name: f.full_name.trim(), whatsapp: f.whatsapp.trim(), email: f.email.trim() || null,
    birth_place: f.birth_place.trim(), birth_date: f.birth_date, gender: f.gender || null,
    address: f.address.trim(), education: f.education, program_slug: f.program_slug,
    country_slug: f.country_slug || null, work_experience: f.work_experience.trim() || null,
    notes: f.notes.trim() || null, consent: f.consent === true,
  };
  const { data, error } = await supabase.rpc('submit_registration', { p: payload });
  if (error) throw new Error(error.message.startsWith('Data tidak valid') ? error.message : 'Pendaftaran belum berhasil dikirim. Silakan coba lagi.');
  return { registration_number: data };
}

export async function isAdminSession() {
  if (!configured) return false;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
  return data?.role === 'admin';
}
export async function adminLogin(email, password) {
  need();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Email atau kata sandi salah.');
  if (!(await isAdminSession())) { await supabase.auth.signOut(); throw new Error('Akun ini tidak memiliki akses admin.'); }
}
export const adminLogout = () => supabase.auth.signOut();

const countBy = async (status) => {
  let q = supabase.from('registrations').select('id', { count: 'exact', head: true });
  if (status) q = q.eq('status', status);
  const { count, error } = await q; if (error) fail(error); return count ?? 0;
};
export async function fetchStats() {
  const [total, pending, processing, accepted] = await Promise.all([countBy(), countBy('Menunggu Verifikasi'), countBy('Sedang Diproses'), countBy('Diterima')]);
  return { total, pending, processing, accepted };
}

function filtered(q, { search, status }) {
  const clean = (search || '').replace(/[,()%*\\]/g, ' ').trim();
  if (clean) q = q.or(`full_name.ilike.*${clean}*,registration_number.ilike.*${clean}*`);
  if (status) q = q.eq('status', status);
  return q;
}
export async function fetchRegistrations({ search, status, page }) {
  const from = page * PAGE_SIZE;
  const q = filtered(supabase.from('registrations').select('id,registration_number,full_name,whatsapp,program_slug,country_slug,status,created_at', { count: 'exact' }), { search, status })
    .order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);
  const { data, count, error } = await q; if (error) fail(error);
  return { rows: data ?? [], total: count ?? 0 };
}
export async function updateStatus(id, status) {
  const { data, error } = await supabase.from('registrations').update({ status }).eq('id', id).select('id');
  if (error) fail(error);
  if (!data?.length) throw new Error('Perubahan ditolak (bukan admin atau data tidak ditemukan).');
}

const cell = (v) => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
export async function exportRegistrationsCsv(filters) {
  const { data, error } = await filtered(supabase.from('registrations').select('*'), filters).order('created_at', { ascending: false }).range(0, 4999);
  if (error) fail(error);
  if (!data.length) throw new Error('Tidak ada data untuk diekspor.');
  const cols = ['registration_number', 'full_name', 'whatsapp', 'email', 'birth_place', 'birth_date', 'gender', 'address', 'education', 'program_slug', 'country_slug', 'work_experience', 'notes', 'status', 'created_at'];
  const csv = '\uFEFF' + [cols.join(','), ...data.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `pendaftaran-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(a.href);
}
