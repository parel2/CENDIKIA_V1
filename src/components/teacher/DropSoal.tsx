import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Loader2, History, Undo2, FileJson, Plus, Replace } from 'lucide-react';
import { validateSoalJSON, appendSoal, replaceSoalAtLevel, getBackups, restoreBackup, type ValidationResult } from '@/lib/customQuestions';

const SAMPLE = `[
  {
    "modul": "berhitung",
    "kelas": 1,
    "level": 1,
    "tipe_soal": "pilihan_ganda",
    "gaya_soal": "soal_cerita",
    "ilustrasi": "🍎 🍎 🍎",
    "pertanyaan": "Berapa jumlah apel?",
    "pilihan": ["2", "3", "4", "5"],
    "jawaban_benar": "3",
    "penjelasan": "Ada 3 apel di gambar."
  }
]`;

type Mode = 'append' | 'replace';

export default function DropSoal() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [mode, setMode] = useState<Mode>('append');
  const [backups, setBackups] = useState<{ id: string; label: string; createdAt: number; count: number }[]>([]);
  const [showBackups, setShowBackups] = useState(false);

  function validate() {
    const r = validateSoalJSON(text);
    setResult(r);
    if (r.ok) {
      setMsg({ type: 'ok', text: `${r.valid.length} soal valid dan siap disimpan.` });
    } else {
      setMsg({ type: 'err', text: `${r.errors.length} error ditemukan. Periksi detail di bawah.` });
    }
  }

  async function save() {
    if (!result?.ok || result.valid.length === 0) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'append') {
        await appendSoal(result.valid);
        setMsg({ type: 'ok', text: `${result.valid.length} soal berhasil ditambahkan!` });
      } else {
        const first = result.valid[0];
        await replaceSoalAtLevel(first.modul, first.level, result.valid);
        setMsg({ type: 'ok', text: `Soal untuk ${first.modul} level ${first.level} berhasil diganti!` });
      }
      setResult(null);
      setText('');
    } catch (e) {
      setMsg({ type: 'err', text: 'Gagal menyimpan. Coba lagi.' });
    } finally {
      setBusy(false);
    }
  }

  async function loadBackups() {
    const b = await getBackups();
    setBackups(b.map((d) => ({ id: d.id, label: d.label, createdAt: d.createdAt, count: d.data.length })));
    setShowBackups(true);
  }

  async function restore(id: string) {
    setBusy(true);
    try {
      await restoreBackup(id);
      setMsg({ type: 'ok', text: 'Backup berhasil dipulihkan!' });
      setShowBackups(false);
    } catch {
      setMsg({ type: 'err', text: 'Gagal memulihkan backup.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileJson className="w-6 h-6 text-sky-600" />
          <h2 className="text-xl font-bold text-slate-800">Drop Soal</h2>
        </div>
        <p className="text-slate-500 text-sm mb-4">
          Tempel JSON soal di bawah, validasi, lalu simpan. Soal akan langsung muncul untuk siswa.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('append')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'append' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
          <button
            onClick={() => setMode('replace')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'replace' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Replace className="w-4 h-4" /> Ganti per Level
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setResult(null); setMsg(null); }}
          placeholder={SAMPLE}
          rows={10}
          className="w-full font-mono text-sm rounded-xl border-2 border-slate-200 p-4 focus:border-sky-400 focus:outline-none resize-y"
        />

        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={validate} disabled={!text.trim()} className="btn-secondary disabled:opacity-40">
            <CheckCircle2 className="w-5 h-5" /> Validasi
          </button>
          <button onClick={save} disabled={!result?.ok || busy} className="btn-primary disabled:opacity-40">
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Simpan Soal
          </button>
          <button onClick={loadBackups} className="btn-secondary">
            <History className="w-5 h-5" /> Riwayat Backup
          </button>
        </div>

        {msg && (
          <div className={`mt-4 rounded-xl p-3 text-sm flex items-start gap-2 ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {msg.type === 'ok' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {result && !result.ok && (
          <div className="mt-4 bg-red-50 rounded-xl p-4">
            <p className="text-sm font-medium text-red-700 mb-2">Error validasi:</p>
            <ul className="space-y-1">
              {result.errors.map((e, i) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result && result.ok && result.valid.length > 0 && (
          <div className="mt-4 bg-emerald-50 rounded-xl p-4">
            <p className="text-sm font-medium text-emerald-700 mb-2">{result.valid.length} soal siap disimpan:</p>
            <div className="space-y-1.5">
              {result.valid.map((d, i) => (
                <div key={i} className="text-xs text-slate-600 bg-white rounded-lg px-3 py-2">
                  <strong>{d.modul}</strong> L{d.level} - {d.tipe_soal === 'menulis' ? `Menulis: "${d.target_tulisan}"` : d.pertanyaan?.slice(0, 50)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBackups && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Riwayat Backup</h3>
            <button onClick={() => setShowBackups(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
          </div>
          {backups.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Belum ada backup.</p>
          ) : (
            <div className="space-y-2">
              {backups.map((b) => (
                <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{b.label}</div>
                    <div className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleString('id-ID')} - {b.count} soal</div>
                  </div>
                  <button onClick={() => restore(b.id)} disabled={busy} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium disabled:opacity-40">
                    <Undo2 className="w-4 h-4" /> Pulihkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
