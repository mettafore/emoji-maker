export async function generateEmoji(prompt: string, userId: string): Promise<string> {
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

    if (data.emojiUrl) {
      return data.emojiUrl;
    }

    throw new Error('Unexpected output format from API');
  } catch (error) {
    console.error('Error calling generate-emoji API:', error);
    throw error;
  }
}
