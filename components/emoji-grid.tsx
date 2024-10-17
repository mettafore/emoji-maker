'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Download, Heart } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllEmojis, toggleEmojiLike, supabase } from '@/lib/supabase';

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

export function EmojiGrid() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [loading, setLoading] = useState(true);
  const [localLikes, setLocalLikes] = useState<Record<number, boolean>>({});

  const updateEmoji = useCallback((updatedEmoji: Emoji) => {
    setEmojis(currentEmojis =>
      currentEmojis.map(emoji =>
        emoji.id === updatedEmoji.id ? { ...emoji, ...updatedEmoji } : emoji
      )
    );
  }, []);

  useEffect(() => {
    async function loadEmojis() {
      const fetchedEmojis = await fetchAllEmojis();
      setEmojis(fetchedEmojis);
      const initialLikes = fetchedEmojis.reduce((acc, emoji) => {
        acc[emoji.id] = emoji.likes_count > 0;
        return acc;
      }, {} as Record<number, boolean>);
      setLocalLikes(initialLikes);
      setLoading(false);
    }

    loadEmojis();

    const channel = supabase
      .channel('emoji_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emojis' }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedEmoji = payload.new as Emoji;
          updateEmoji(updatedEmoji);
          if (!localLikes[updatedEmoji.id]) {
            localLikes[updatedEmoji.id] = updatedEmoji.likes_count > 0;
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateEmoji]);

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

  const handleLike = async (id: number) => {
    const emoji = emojis.find(e => e.id === id);
    if (!emoji) return;

    // Toggle local like state immediately
    setLocalLikes(prev => ({ ...prev, [id]: !prev[id] }));

    // Update emoji likes count optimistically
    const newLikesCount = localLikes[id] ? emoji.likes_count - 1 : emoji.likes_count + 1;
    setEmojis(current => 
      current.map(e => e.id === id ? { ...e, likes_count: newLikesCount } : e)
    );

    // Send request to server
    await toggleEmojiLike(id);
    // Note: We're not updating state based on the server response
    // The real-time subscription will handle any discrepancies
  };

  const renderEmojiCard = (emoji: Emoji) => (
    <Card key={emoji.id} className="relative group">
      <Image
        src={emoji.image_url}
        alt={`Generated emoji ${emoji.id}`}
        width={100}
        height={100}
        className="w-full h-auto"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-white p-2" onClick={() => handleDownload(emoji.image_url, emoji.id)}>
          <Download size={24} />
        </button>
        <button
          className={`text-white p-2 ${localLikes[emoji.id] ? 'text-red-500' : ''}`}
          onClick={() => handleLike(emoji.id)}
        >
          <Heart size={24} fill={localLikes[emoji.id] ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-center text-gray-500 mt-2">{emoji.likes_count} Likes</p>
    </Card>
  );

  if (loading) {
    return <p className="text-center text-gray-500">Loading emojis...</p>;
  }

  return (
    <div className="space-y-8">
      {emojis.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Newly Generated Emoji</h2>
            <div className="flex justify-center">
              {renderEmojiCard(emojis[0])}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">All Emojis</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {emojis.map((emoji) => renderEmojiCard(emoji))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No emojis generated yet.</p>
      )}
    </div>
  );
}
