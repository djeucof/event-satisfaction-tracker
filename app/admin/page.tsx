'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// English comments: Admin credentials are now protected via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  // Use env variable for the password check (client-side simplified)
  const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'fallback_if_not_set';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_CODE) {
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

  const filteredVotes = votes.filter(v => 
    (v.event_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [searchTerm, setSearchTerm] = useState('');

  const downloadCSV = () => {
    const BOM = "\uFEFF";
    const headers = "Päivämäärä,Kellonaika,Tapahtuma,Palaute\n";
    const rows = filteredVotes.map(v => {
      const dateObj = new Date(v.created_at);
      const date = dateObj.toLocaleDateString('fi-FI');
      const time = dateObj.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
      let feedback = v.vote === 'like' ? 'Tykkäsi' : v.vote === 'neutral' ? 'Neutraali' : 'Ei tykännyt';
      return `${date},${time},${v.event_name || '—'},${feedback}`;
    }).join("\n");
    
    const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `palaute_${searchTerm || 'kaikki'}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-white shadow-xl rounded-lg border">
          <h2 className="text-xl font-bold mb-4 text-[#a664a6]">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Salasana" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4 outline-none focus:border-[#a664a6]"
          />
          <button type="submit" className="w-full bg-[#a664a6] text-white py-2 rounded font-bold">Kirjaudu</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans bg-white min-h-screen text-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#a664a6]">Tulokset</h1>
        <div className="flex flex-wrap gap-2">
          <input 
            type="text"
            placeholder="Etsi tapahtumaa..."
            className="border p-2 rounded text-sm text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Lataa CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th className="p-3">Aika</th>
              <th className="p-3">Tapahtuma</th>
              <th className="p-3 text-center">Vastaus</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredVotes.map((v) => (
              <tr key={v.id}>
                <td className="p-3 text-xs text-gray-500">{new Date(v.created_at).toLocaleString('fi-FI')}</td>
                <td className="p-3 font-medium">{v.event_name || '—'}</td>
                <td className="p-3 text-2xl text-center">
                   {v.vote === 'like' ? '😃' : v.vote === 'neutral' ? '😐' : '😞'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
