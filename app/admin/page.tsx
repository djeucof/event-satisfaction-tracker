'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuration from Environment Variables for Security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State initialized correctly at the top

  // Admin access code from Vercel Environment Variables
  const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'YV2026';

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

  // Filter logic: using searchTerm safely
  const filteredVotes = votes.filter(v => 
    (v.event_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const BOM = "\uFEFF"; // Fix for Finnish characters in Excel
    const headers = "Päivämäärä,Kellonaika,Tapahtuma,Palaute\n";
    
    const rows = filteredVotes.map(v => {
      const dateObj = new Date(v.created_at);
      const date = dateObj.toLocaleDateString('fi-FI');
      const time = dateObj.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
      const feedback = v.vote === 'like' ? 'Tykkäsi' : v.vote === 'neutral' ? 'Neutraali' : 'Ei tykännyt';
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-black">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-white shadow-xl rounded-lg border">
          <h2 className="text-xl font-bold mb-4 text-[#a664a6]">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Salasana" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4 outline-none focus:border-[#a664a6]"
          />
          <button type="submit" className="w-full bg-[#a664a6] text-white py-2 rounded font-bold transition-opacity hover:opacity-90">
            Kirjaudu
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans bg-white min-h-screen text-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#a664a6]">Tulokset</h1>
          <p className="text-xs text-gray-400">Suojattu tila</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Etsi tapahtumaa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded text-sm w-full md:w-64 outline-none focus:border-[#a664a6] text-black"
          />
          <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-green-700">
            Lataa CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-3 border-b text-black">Aika</th>
              <th className="p-3 border-b text-black">Tapahtuma</th>
              <th className="p-3 border-b text-center text-black">Vastaus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVotes.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors text-black">
                <td className="p-3 text-xs text-gray-500">
                  {new Date(v.created_at).toLocaleString('fi-FI')}
                </td>
                <td className="p-3 font-medium italic">
                  {v.event_name || '—'}
                </td>
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
