'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Download, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllEmojis } from '@/lib/supabase';

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

  useEffect(() => {
    async function loadEmojis() {
      const fetchedEmojis = await fetchAllEmojis();
      setEmojis(fetchedEmojis);
      setLoading(false);
    }

    loadEmojis();
  }, []);

  // Change likes state to an object
  const [likes, setLikes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    setLikes(prevLikes => {
      const newLikes: { [key: number]: number } = {};
      emojis.forEach(emoji => {
        newLikes[emoji.id] = prevLikes[emoji.id] || 0; // Initialize likes for each emoji
      });
      return newLikes;
    });
  }, [emojis]);

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
    console.log('id:', id);
    console.log('likes:', likes);
    try {
      const response = { ok: true }; // Mock response for testing

      if (response.ok) {
        console.log('response.ok');
        setLikes(prevLikes => {
          const newLikes = { ...prevLikes };
          // Toggle like: if already liked, unlike (decrease count), otherwise like (increase count)
          newLikes[id] = newLikes[id] > 0 ? newLikes[id] - 1 : (newLikes[id] || 0) + 1;
          return newLikes;
        });
      } else {
        console.error('Failed to toggle like for emoji');
      }
    } catch (error) {
      console.error('Error toggling like for emoji:', error);
    }
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
          className={`text-white p-2 ${likes[emoji.id] > 0 ? 'text-red-500' : ''}`}
          onClick={() => handleLike(emoji.id)}
        >
          <Heart size={24} fill={likes[emoji.id] > 0 ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-center text-gray-500 mt-2">{likes[emoji.id] || 0} Likes</p>
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
