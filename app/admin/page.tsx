'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
const supabaseUrl = 'https://eufysgruxfxrpujczmpg.supabase.co';
const supabaseAnonKey = 'sb_publishable_UgBgAk3q6_rpSfIHIjintg_MqwuGv9Z';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'YV2026') {
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

  const filteredVotes = votes.filter((v) =>
    (v.event_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simplified CSV export for humans
  const downloadCSV = () => {
    // Human-readable headers
    const headers = 'Päivämäärä,Kellonaika,Tapahtuma,Palaute\n';

    const rows = filteredVotes
      .map((v) => {
        const dateObj = new Date(v.created_at);
        const date = dateObj.toLocaleDateString('fi-FI');
        const time = dateObj.toLocaleTimeString('fi-FI', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const event = v.event_name || '—';

        // Map technical terms to friendly ones
        let feedback = 'Neutraali';
        if (v.vote === 'like') feedback = 'Tykkäsi';
        if (v.vote === 'dislike') feedback = 'Ei tykännyt';

        return `${date},${time},${event},${feedback}`;
      })
      .join('\n');

    // Using BOM to ensure Excel opens Finnish characters correctly
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + headers + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `palaute_${
      searchTerm || 'kaikki'
    }_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 bg-white shadow-xl rounded-lg border"
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

  return (
    <div className="p-4 md:p-8 font-sans bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#a664a6]">
            Tulokset (Admin)
          </h1>
          <p className="text-sm text-gray-500">
            Yhteensä: {filteredVotes.length} vastausta
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Etsi tapahtuman nimellä..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded text-sm w-full md:w-64 outline-none focus:border-[#a664a6]"
          />
          <button
            onClick={fetchVotes}
            className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50"
          >
            Päivitä
          </button>
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700"
          >
            Lataa Excel (CSV)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-sm border rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-3 border-b">Aika</th>
              <th className="p-3 border-b">Tapahtuma</th>
              <th className="p-3 border-b text-center">Vastaus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVotes.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">
                  {new Date(v.created_at).toLocaleString('fi-FI', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-3 font-medium text-gray-800 italic">
                  {v.event_name || '—'}
                </td>
                <td className="p-3 text-3xl text-center">
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
