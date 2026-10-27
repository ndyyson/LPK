import { supabase } from './supabase.js';

// ===== NEWS =====
export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createNews(payload) {
  const { data, error } = await supabase
    .from('news')
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateNews(id, payload) {
  const { data, error } = await supabase
    .from('news')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ===== PHOTOS =====
export async function fetchPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createPhoto(payload) {
  const { data, error } = await supabase
    .from('photos')
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePhoto(id, payload) {
  const { data, error } = await supabase
    .from('photos')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePhoto(id) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ===== DOCUMENTS =====
export async function fetchDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createDocument(payload) {
  const { data, error } = await supabase
    .from('documents')
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateDocument(id, payload) {
  const { data, error } = await supabase
    .from('documents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDocument(id) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ===== THUMBNAILS =====
export async function fetchThumbnails() {
  const { data, error } = await supabase
    .from('thumbnails')
    .select('*')
    .order('section', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createThumbnail(payload) {
  const { data, error } = await supabase
    .from('thumbnails')
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateThumbnail(id, payload) {
  const { data, error } = await supabase
    .from('thumbnails')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteThumbnail(id) {
  const { error } = await supabase
    .from('thumbnails')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ===== FILE UPLOAD =====
export async function uploadFile(bucket, file, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getFileUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  if (error) throw new Error(error.message);
}
