'use client';

import { useState } from 'react';
import { EmojiForm } from '../components/emoji-form';
import { EmojiGrid } from '../components/emoji-grid';
import { generateEmoji } from '../lib/replicate';

export default function Home() {
  const [generatedEmojis, setGeneratedEmojis] = useState<string[]>([]);

  const handleGenerateEmoji = async (prompt: string) => {
    try {
      const emojiUrl = await generateEmoji(prompt);
      setGeneratedEmojis((prev) => [...prev, emojiUrl]);
    } catch (error) {
      console.error('Failed to generate emoji:', error);
      // TODO: Add error handling UI
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🤖 Emoji Maker</h1>
        <div className="flex flex-col items-center gap-8">
          <EmojiForm onGenerate={handleGenerateEmoji} />
          <EmojiGrid emojis={generatedEmojis} />
        </div>
      </div>
    </div>
  );
}
