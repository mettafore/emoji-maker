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

export async function toggleEmojiLike(emojiId: number): Promise<{ success: boolean; likesCount: number }> {
  try {
    // First, try to use the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('toggle_emoji_like', { emoji_id: emojiId });

    if (rpcError && rpcError.code === 'PGRST202') {
      // If the function is not found, fall back to manual toggle
      console.warn('toggle_emoji_like function not found, falling back to manual toggle');
      return manualToggleEmojiLike(emojiId);
    } else if (rpcError) {
      console.error('Error toggling like:', rpcError);
      return { success: false, likesCount: 0 };
    }

    return { success: true, likesCount: rpcData.likes_count };
  } catch (error) {
    console.error('Error in toggleEmojiLike:', error);
    return { success: false, likesCount: 0 };
  }
}

async function manualToggleEmojiLike(emojiId: number): Promise<{ success: boolean; likesCount: number }> {
  // Start a transaction
  const { data: emoji, error: fetchError } = await supabase
    .from('emojis')
    .select('id, likes_count, user_likes')
    .eq('id', emojiId)
    .single();

  if (fetchError) {
    console.error('Error fetching emoji:', fetchError);
    return { success: false, likesCount: 0 };
  }

  const newLikesCount = emoji.likes_count + 1;
  const newUserLikes = [...(emoji.user_likes || []), 'current_user_id']; // Replace 'current_user_id' with actual user ID

  const { data: updatedEmoji, error: updateError } = await supabase
    .from('emojis')
    .update({ likes_count: newLikesCount, user_likes: newUserLikes })
    .eq('id', emojiId)
    .select('likes_count')
    .single();

  if (updateError) {
    console.error('Error updating emoji:', updateError);
    return { success: false, likesCount: 0 };
  }

  return { success: true, likesCount: updatedEmoji.likes_count };
}

// Add any other Supabase-related functions here
