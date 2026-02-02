'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// English comments for the logic
const supabaseUrl = 'https://eufysgruxfxrpujczmpg.supabase.co';
const supabaseAnonKey = 'sb_publishable_UgBgAk3q6_rpSfIHIjintg_MqwuGv9Z';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Password check function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'YV2026&&&77') {
      // YOU CAN CHANGE PASSWORD HERE
      setIsAuthenticated(true);
      fetchVotes();
    } else {
      alert('Väärä salasana!');
    }
  };

  async function fetchVotes() {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVotes(data);
  }

  const downloadCSV = () => {
    const headers = 'ID,Aika,Tapahtuma,Vastaus\n';
    const rows = votes
      .map((v) => `${v.id},${v.created_at},${v.event_name || ''},${v.vote}`)
      .join('\n');
    const blob = new Blob([headers + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tulokset_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="p-8 bg-white shadow-xl rounded-lg border"
        >
          <h2 className="text-xl font-bold mb-4 text-[#a664a6]">
            Kirjaudu sisään
          </h2>
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4 outline-none focus:border-[#a664a6]"
          />
          <button
            type="submit"
            className="w-full bg-[#a664a6] text-white py-2 rounded font-bold"
          >
            Avaa tulokset
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard (visible only after password)
  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#a664a6]">Tulokset (Admin)</h1>
        <div className="flex gap-4">
          <button
            onClick={fetchVotes}
            className="border border-[#a664a6] text-[#a664a6] px-4 py-2 rounded"
          >
            Päivitä
          </button>
          <button
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Lataa Excel (CSV)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Aika</th>
              <th className="border p-2">Tapahtuma</th>
              <th className="border p-2">Vastaus</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((v) => (
              <tr key={v.id} className="text-center hover:bg-gray-50">
                <td className="border p-2 text-sm">
                  {new Date(v.created_at).toLocaleString('fi-FI')}
                </td>
                <td className="border p-2 font-medium">
                  {v.event_name || '—'}
                </td>
                <td className="border p-2 text-2xl">
                  {v.vote === 'like'
                    ? '😃'
                    : v.vote === 'neutral'
                    ? '😐'
                    : '😞'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
