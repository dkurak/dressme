import { supabase } from './supabase';

const BUCKET = 'items';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadItemImage(
  userId: string,
  file: File
): Promise<{ url: string; path: string } | { error: string }> {
  if (!supabase) return { error: 'Storage not configured' };

  if (!file.type.startsWith('image/')) {
    return { error: 'Please select an image file' };
  }

  if (file.size > MAX_SIZE) {
    return { error: 'Image must be less than 5MB' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return { error: 'Failed to upload image' };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, path: fileName };
}

export async function deleteItemImage(path: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error('Delete error:', error);
}
