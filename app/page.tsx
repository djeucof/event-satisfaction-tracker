'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// English comments as requested.
const supabaseUrl = 'https://eufysgruxfxrpujczmpg.supabase.co';
const supabaseAnonKey = 'sb_publishable_UgBgAk3q6_rpSfIHIjintg_MqwuGv9Z';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VotingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [eventName, setEventName] = useState('');

  // Load event name from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('current_event');
    if (saved) setEventName(saved);
  }, []);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEventName(val);
    localStorage.setItem('current_event', val);
  };

  async function sendVote(type: 'like' | 'neutral' | 'dislike') {
    try {
      const { error } = await supabase.from('feedback').insert([
        {
          vote: type,
          event_name: eventName || 'Yleinen', // Default if empty
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert('Hups! Jotain meni pieleen.');
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-100 px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-green-600 animate-pulse text-center">
          Kiitos! 😊
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10">
      {/* Admin setup field - hide or stylize as needed */}
      <div className="absolute top-4 right-4">
        <input
          type="text"
          placeholder="Tapahtuman nimi..."
          value={eventName}
          onChange={handleEventChange}
          className="text-xs border p-1 rounded text-gray-400 focus:text-black outline-none"
        />
      </div>

      <h1 className="mb-10 text-3xl md:text-4xl font-black text-[#a664a6] text-center uppercase">
        Oliko kivaa?
      </h1>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        <button
          onClick={() => sendVote('like')}
          className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-green-100 text-6xl md:text-8xl shadow-lg transition-transform hover:scale-110 active:scale-90 flex items-center justify-center border-4 border-green-200"
        >
          😃
        </button>
        <button
          onClick={() => sendVote('neutral')}
          className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-yellow-100 text-6xl md:text-8xl shadow-lg transition-transform hover:scale-110 active:scale-90 flex items-center justify-center border-4 border-yellow-200"
        >
          😐
        </button>
        <button
          onClick={() => sendVote('dislike')}
          className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-red-100 text-6xl md:text-8xl shadow-lg transition-transform hover:scale-110 active:scale-90 flex items-center justify-center border-4 border-red-200"
        >
          😞
        </button>
      </div>

      <p className="mt-16 text-[#9eae2b] font-bold uppercase tracking-widest text-center border-t pt-4">
        Yksin vanhempana ry
      </p>
    </div>
  );
}
