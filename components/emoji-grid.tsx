'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Download, Heart } from 'lucide-react';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  console.log('emojis:', emojis); // Keep this debug log

  const handleDownload = (emojiUrl: string, index: number) => {
    fetch(emojiUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `emoji-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error downloading emoji:', error));
  };

  const renderEmojiCard = (emoji: string, index: number) => (
    <Card key={index} className="relative group">
      <Image
        src={emoji}
        alt={`Generated emoji ${index + 1}`}
        width={100}
        height={100}
        className="w-full h-auto"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-white p-2" onClick={() => handleDownload(emoji, index)}>
          <Download size={24} />
        </button>
        <button className="text-white p-2">
          <Heart size={24} />
        </button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {emojis.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Newly Generated Emoji</h2>
            <div className="flex justify-center">
              {renderEmojiCard(emojis[emojis.length - 1], emojis.length - 1)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">All Emojis</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {emojis.map((emoji, index) => renderEmojiCard(emoji, index))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No emojis generated yet.</p>
      )}
    </div>
  );
}
