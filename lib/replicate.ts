interface Emoji {
  id: string;
  url: string;
  prompt: string;
  userId: string;
  createdAt: Date;
}

export async function generateEmoji(prompt: string, userId: string): Promise<{ emojiUrl: string, newEmoji: Emoji }> {
  console.log('Calling generate-emoji API with prompt:', prompt);
  
  try {
    const response = await fetch('/api/generate-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, userId }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    console.log('API response:', data);

    if (data.emojiUrl && data.newEmoji) {
      // The API has already inserted the emoji into the database
      return { emojiUrl: data.emojiUrl, newEmoji: data.newEmoji as Emoji };
    }

    throw new Error('Unexpected output format from API');
  } catch (error) {
    console.error('Error calling generate-emoji API:', error);
    throw error;
  }
}
