'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Download, Heart } from 'lucide-react';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <Card key={index} className="relative group">
          <Image
            src={emoji}
            alt={`Generated emoji ${index + 1}`}
            width={100}
            height={100}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-white p-2" onClick={() => window.open(emoji, '_blank')}>
              <Download size={24} />
            </button>
            <button className="text-white p-2">
              <Heart size={24} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}