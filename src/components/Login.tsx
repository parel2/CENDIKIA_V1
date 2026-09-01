import { useState, type FormEvent } from 'react';
import { BookOpen, Calculator, GraduationCap, PenLine, User, Lock, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginGuru, loginSiswa } from '@/lib/firestore';

type Role = 'pilih' | 'siswa' | 'guru';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('pilih');
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [oktena, setOktena] = useState('');
  const [kelas, setKelas] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!nama.trim() || !password) {
      setError('Nama dan password wajib diisi.');
      return;
    }
    setBusy(true);
    try {
      if (role === 'guru') {
        const { profile } = await loginGuru(nama, password, oktena);
        login(profile);
      } else {
        const { profile } = await loginSiswa(nama, password, kelas);
        login(profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setNama('');
    setPassword('');
    setOktena('');
    setKelas(1);
    setError('');
  }

  if (role === 'pilih') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-amber-50 p-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-lg mb-4">
            <GraduationCap className="w-11 h-11 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Les Calistung</h1>
          <p className="text-slate-500 mt-2 text-lg">Belajar Membaca, Menulis & Berhitung</p>
        </div>
        <div className="grid gap-4 w-full max-w-md">
          <button
            onClick={() => { setRole('siswa'); reset(); }}
            className="group flex items-center gap-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100">
              <User className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xl font-bold text-slate-800">Saya Siswa</div>
              <div className="text-slate-500 text-sm">Belajar mambaca, menulis, berhitung</div>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>
          <button
            onClick={() => { setRole('guru'); reset(); }}
            className="group flex items-center gap-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-sky-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100">
              <GraduationCap className="w-7 h-7 text-sky-600" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xl font-bold text-slate-800">Saya Guru</div>
              <div className="text-slate-500 text-sm">Pantau progres semua siswa</div>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
        <div className="flex gap-6 mt-10 text-slate-400">
          <BookOpen className="w-7 h-7" />
          <PenLine className="w-7 h-7" />
          <Calculator className="w-7 h-7" />
        </div>
      </div>
    );
  }

  const isGuru = role === 'guru';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-gradient-to-br ${isGuru ? 'from-sky-50 via-blue-50 to-indigo-50' : 'from-emerald-50 via-teal-50 to-sky-50'}`}>
      <div className="w-full max-w-md">
        <button onClick={() => { setRole('pilih'); reset(); }} className="text-slate-500 hover:text-slate-700 mb-4 text-sm flex items-center gap-1">
          &larr; Kembali
        </button>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${isGuru ? 'bg-sky-100' : 'bg-emerald-100'}`}>
              {isGuru ? <GraduationCap className="w-8 h-8 text-sky-600" /> : <User className="w-8 h-8 text-emerald-600" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{isGuru ? 'Login Guru' : 'Login Siswa'}</h2>
            <p className="text-slate-500 text-sm mt-1">{isGuru ? 'Masuk untuk melihat dashboard' : 'Masuk untuk mulai belajar'}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama">
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Tulis nama lengkap" className="input" autoComplete="off" />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password kamu" className="input" />
            </Field>
            {!isGuru && (
              <Field label="Kelas">
                <select value={kelas} onChange={(e) => setKelas(Number(e.target.value))} className="input">
                  {[1, 2, 3, 4, 5].map((k) => <option key={k} value={k}>Kelas {k}</option>)}
                </select>
              </Field>
            )}
            {isGuru && (
              <Field label="Kode Oktena">
                <input type="password" value={oktena} onChange={(e) => setOktena(e.target.value)} placeholder="Kode rahasia guru" className="input" />
              </Field>
            )}
            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : (isGuru ? 'Masuk sebagai Guru' : 'Masuk / Daftar')}
            </button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-4">
            Belum punya akun? Isi nama baru, kamu akan didaftarkan otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
