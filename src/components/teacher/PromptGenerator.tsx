import { useState } from 'react';
import { Copy, Check, Sparkles, Wand2 } from 'lucide-react';

const MODULS = ['berhitung', 'membaca', 'menulis'];
const GAYA = ['biasa', 'soal_cerita'];
const TIPE = ['pilihan_ganda', 'menulis'];

export default function PromptGenerator() {
  const [modul, setModul] = useState('berhitung');
  const [kelas, setKelas] = useState(1);
  const [level, setLevel] = useState(1);
  const [tipe, setTipe] = useState('pilihan_ganda');
  const [gaya, setGaya] = useState('biasa');
  const [jumlah, setJumlah] = useState(5);
  const [copied, setCopied] = useState(false);

  const prompt = buildPrompt();

  function buildPrompt(): string {
    const lines: string[] = [];
    lines.push('Buatkan ' + jumlah + ' soal untuk siswa SD kelas ' + kelas + ' dengan spesifikasi berikut:');
    lines.push('');
    lines.push('- Modul: ' + modul);
    lines.push('- Level: ' + level);
    lines.push('- Tipe soal: ' + tipe);
    if (tipe === 'pilihan_ganda') {
      lines.push('- Gaya soal: ' + gaya);
      lines.push('- Jumlah pilihan: 4');
      lines.push('- Setiap soal harus ada: pertanyaan, pilihan (array), jawaban_benar (string yang sama persis dengan salah satu pilihan), dan penjelasan.');
    }
    if (gaya === 'soal_cerita') {
      lines.push('- Buat soal dalam bentuk cerita singkat yang menarik untuk anak.');
    }
    if (modul === 'berhitung' && tipe === 'pilihan_ganda') {
      lines.push('- Gunakan ilustrasi emoji untuk membantu visualisasi (contoh: 🍎🍎🍎).');
    }
    if (modul === 'membaca') {
      lines.push('- Sertakan teks_bacaan yang siswa baca sebelum menjawab.');
    }
    if (tipe === 'menulis') {
      lines.push('- Sertakan target_tulisan (huruf/kata/kalimat yang harus ditiru) dan hint.');
    }
    lines.push('');
    lines.push('Format output HARUS berupa JSON array yang valid dengan field:');
    lines.push('modul, kelas, level, tipe_soal, gaya_soal, ilustrasi, pertanyaan, pilihan, jawaban_benar, penjelasan, teks_bacaan, target_tulisan, hint');
    lines.push('');
    lines.push('Hanya balas dengan JSON array, tanpa penjelasan tambahan.');

    return lines.join('\n');
  }

  function copy() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-6 h-6 text-violet-600" />
          <h2 className="text-xl font-bold text-slate-800">Generator Prompt AI</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6">
          Atur spesifikasi, salin prompt, tempel ke AI (ChatGPT, Gemini, dll), lalu tempel hasil JSON-nya ke menu Drop Soal.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Modul">
            <select value={modul} onChange={(e) => setModul(e.target.value)} className="input">
              {MODULS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Tipe Soal">
            <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="input">
              {TIPE.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Kelas">
            <select value={kelas} onChange={(e) => setKelas(Number(e.target.value))} className="input">
              {[1, 2, 3, 4, 5].map((k) => <option key={k} value={k}>Kelas {k}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="input">
              {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </Field>
          {tipe === 'pilihan_ganda' && (
            <Field label="Gaya Soal">
              <select value={gaya} onChange={(e) => setGaya(e.target.value)} className="input">
                {GAYA.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
          )}
          <Field label="Jumlah Soal">
            <input type="number" min={1} max={20} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className="input" />
          </Field>
        </div>

        <div className="relative">
          <pre className="bg-slate-800 text-slate-100 rounded-xl p-4 text-sm overflow-auto max-h-80 whitespace-pre-wrap font-mono">
            {prompt}
          </pre>
          <button
            onClick={copy}
            className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin!' : 'Salin'}
          </button>
        </div>

        <div className="mt-4 bg-violet-50 rounded-xl p-4 flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            Setelah AI menghasilkan JSON, masuk ke menu <strong>Drop Soal</strong>, tempel JSON-nya, klik <strong>Validasi</strong>, lalu <strong>Simpan</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
