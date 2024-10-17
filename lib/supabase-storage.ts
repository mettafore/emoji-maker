import { supabase } from './supabase';

export async function uploadEmojiToStorage(buffer: Buffer, fileName: string): Promise<string | null> {
  const { error } = await supabase.storage
    .from('emojis')
    .upload(`public/${fileName}`, buffer, {
      contentType: 'image/png'
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('emojis')
    .getPublicUrl(`public/${fileName}`);

  return publicUrlData.publicUrl;
}
