'use client';

import { useState } from 'react';
import { EmojiForm } from '../components/emoji-form';
import { EmojiGrid } from '../components/emoji-grid';
import { generateEmoji } from '../lib/replicate';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGenerateEmoji = async (prompt: string) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating emoji for prompt:', prompt);
      await generateEmoji(prompt, user.id);
      setRefreshTrigger(prev => prev + 1); // This is where refreshTrigger changes
    } catch (error) {
      console.error('Failed to generate emoji:', error);
      // TODO: Add error handling UI
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🤖 Emoji Maker</h1>
        <div className="flex flex-col items-center gap-8">
          <EmojiForm onGenerate={handleGenerateEmoji} isGenerating={isGenerating} />
          <EmojiGrid refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
