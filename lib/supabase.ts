import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchAllEmojis() {
  const { data, error } = await supabase
    .from('emojis')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching emojis:', error);
    return [];
  }

  return data;
}
