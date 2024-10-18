import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import { uploadEmojiToStorage } from '@/lib/supabase-storage';
import { supabase } from '@/lib/supabase';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Handler started');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt, userId } = req.body;
  console.log('Received prompt:', prompt, 'userId:', userId);

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const modifiedPrompt = "A TOK emoji of " + prompt;
    console.log('Modified prompt:', modifiedPrompt);

    console.log('Calling Replicate API');
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: modifiedPrompt,
          apply_watermark: false,
        },
      }
    );
    console.log('Replicate API response:', output);

    if (Array.isArray(output) && output.length > 0 && output[0] instanceof ReadableStream) {
      const stream = output[0];
      const chunks = [];
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks, { type: 'image/png' });
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase storage
      let imageUrl;
      try {
        const fileName = `emoji_${Date.now()}.png`;
        imageUrl = await uploadEmojiToStorage(buffer, fileName);
        if (!imageUrl) {
          throw new Error('Failed to upload emoji to storage');
        }
      } catch (error) {
        console.error('Error uploading emoji to storage:', error);
        return res.status(500).json({ message: 'Error uploading emoji to storage' });
      }

      if (imageUrl) {
        // Add entry to emojis table
        try {
          const { data, error } = await supabase
            .from('emojis')
            .insert({
              image_url: imageUrl,
              prompt: prompt,
              creator_user_id: userId,
            })
            .select()
            .single(); // Change this to single() to ensure we only get one row

          if (error) throw error;

          if (data) {
            return res.status(200).json({ emojiUrl: imageUrl, newEmoji: data });
          } else {
            throw new Error('Emoji inserted but no data returned');
          }
        } catch (error) {
          console.error('Error inserting emoji data:', error);
          return res.status(500).json({ message: 'Error saving emoji data' });
        }
      } else {
        return res.status(500).json({ message: 'Error uploading emoji to storage' });
      }
    } else {
      console.error('Unexpected output format from Replicate API:', output);
      return res.status(500).json({ message: 'Unexpected output format from Replicate API' });
    }
  } catch (error) {
    console.error('Error generating emoji:', error);
    return res.status(500).json({ 
      message: 'Error generating emoji', 
      error: error instanceof Error ? error.toString() : 'Unknown error' 
    });
  }
}
