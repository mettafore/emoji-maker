import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadEmojiToStorage(buffer: Buffer, fileName: string): Promise<string | null> {
  const { data, error } = await supabase.storage
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
