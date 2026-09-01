import { useEffect, useState } from 'react';
import { LogOut, Users, BookOpen, PenLine, Calculator, TrendingUp, Loader2, LayoutDashboard, FileJson, Wand2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllSiswa } from '@/lib/firestore';
import { CURRICULUM } from '@/curriculum';
import type { UserProfile } from '@/types';
import DropSoal from './teacher/DropSoal';
import PromptGenerator from './teacher/PromptGenerator';

type Tab = 'dashboard' | 'dropsoal' | 'prompt';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [siswa, setSiswa] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UserProfile | null>(null);

  useEffect(() => {
    getAllSiswa()
      .then(setSiswa)
      .catch(() => setSiswa([]))
      .finally(() => setLoading(false));
  }, []);

  const totalChapters = CURRICULUM.reduce((a, m) => a + m.levels.reduce((b, l) => b + l.chapters.length, 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span className="font-bold text-slate-800 text-lg">Dashboard Guru</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.nama}</span>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Keluar">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 border-t border-slate-100">
          <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
          <TabButton active={tab === 'dropsoal'} onClick={() => setTab('dropsoal')} icon={FileJson} label="Drop Soal" />
          <TabButton active={tab === 'prompt'} onClick={() => setTab('prompt')} icon={Wand2} label="Prompt AI" />
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard label="Total Siswa" value={siswa.length} icon={Users} color="sky" />
              <StatCard label="Modul Belajar" value={CURRICULUM.length} icon={BookOpen} color="emerald" />
              <StatCard label="Total Bab" value={totalChapters} icon={PenLine} color="blue" />
              <StatCard label="Total Selesai" value={siswa.reduce((a, s) => a + Object.keys(s.progress ?? {}).length, 0)} icon={TrendingUp} color="amber" />
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : siswa.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                Belum ada siswa terdaftar. Siswa akan muncul di sini setelah login.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Nama</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 hidden sm:table-cell">Kelas</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Bab Dikerjakan</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Rata-rata</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {siswa.map((s) => {
                      const prog = s.progress ?? {};
                      const done = Object.keys(prog).length;
                      const avg = done ? Math.round(Object.values(prog).reduce((a, p) => a + p.bestScore, 0) / done) : 0;
                      return (
                        <tr key={s.uid} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{s.nama}</td>
                          <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">Kelas {s.kelas ?? '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{done} / {totalChapters}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${avg >= 70 ? 'bg-emerald-100 text-emerald-700' : avg > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                              {done ? avg : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setSelected(s)} className="text-sm text-sky-600 hover:text-sky-700 font-medium">Detail</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'dropsoal' && <DropSoal />}
        {tab === 'prompt' && <PromptGenerator />}
      </main>

      {selected && <DetailModal siswa={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Users; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${active ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Users; color: string }) {
  const map: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${map[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function DetailModal({ siswa, onClose }: { siswa: UserProfile; onClose: () => void }) {
  const prog = siswa.progress ?? {};
  const entries = Object.entries(prog).sort((a, b) => b[1].lastPlayed - a[1].lastPlayed);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{siswa.nama}</h3>
            <span className="text-sm text-slate-500">Kelas {siswa.kelas ?? '-'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>
        <div className="p-5">
          {entries.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Belum ada riwayat belajar.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="pb-2">Bab</th><th className="pb-2 text-center">Terbaik</th><th className="pb-2 text-center">Terakhir</th><th className="pb-2 text-center">Coba</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map(([id, p]) => (
                  <tr key={id}>
                    <td className="py-2 text-slate-700">{findChapterTitle(id)}</td>
                    <td className="py-2 text-center font-medium text-emerald-600">{p.bestScore}</td>
                    <td className="py-2 text-center text-slate-600">{p.lastScore}</td>
                    <td className="py-2 text-center text-slate-400">{p.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function findChapterTitle(id: string): string {
  for (const m of CURRICULUM) {
    for (const lv of m.levels) {
      const ch = lv.chapters.find((c) => c.id === id);
      if (ch) return `${m.title} - ${ch.title}`;
    }
  }
  return id;
}
