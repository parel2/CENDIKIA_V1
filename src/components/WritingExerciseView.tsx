import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, RotateCcw, Award, CheckCircle2, Eraser } from 'lucide-react';
import type { WritingExercise } from '@/types';
import DrawingPad, { type DrawingPadHandle } from './DrawingPad';

interface Props {
  exercises: WritingExercise[];
  chapterTitle: string;
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function WritingExerciseView({ exercises, chapterTitle, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [teacherApproved, setTeacherApproved] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const padRef = useRef<DrawingPadHandle>(null);

  const ex = exercises[current];
  const total = exercises.length;

  useEffect(() => {
    setTeacherApproved(false);
    setMatchScore(null);
  }, [current]);

  function checkMatch() {
    if (!padRef.current || padRef.current.isEmpty()) return;
    const targetCanvas = renderTextToCanvas(ex.targetPattern ?? ex.targetText);
    const score = padRef.current.compareWith(targetCanvas);
    setMatchScore(score);
  }

  function handleTeacherApprove() {
    if (!padRef.current || padRef.current.isEmpty()) return;
    setTeacherApproved(true);
    checkMatch();
  }

  function next() {
    const score = matchScore ?? 0;
    const updated = [...scores, score];
    setScores(updated);
    setTeacherApproved(false);
    setMatchScore(null);
    padRef.current?.clear();
    if (current + 1 >= total) {
      const avg = Math.round(updated.reduce((a, b) => a + b, 0) / updated.length);
      setDone(true);
      onComplete(avg);
    } else {
      setCurrent(current + 1);
    }
  }

  if (done) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${avg >= 60 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <Award className={`w-10 h-10 ${avg >= 60 ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Latihan Selesai!</h2>
          <div className="text-5xl font-bold my-4 text-slate-800">{avg}</div>
          <p className="text-slate-500">Kecocokan rata-rata tulisan dengan contoh</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setCurrent(0); setScores([]); setDone(false); setTeacherApproved(false); setMatchScore(null); }}
              className="btn-secondary flex-1"
            >
              <RotateCcw className="w-5 h-5" /> Ulangi
            </button>
            <button onClick={onBack} className="btn-primary flex-1">
              <Home className="w-5 h-5" /> Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = padRef.current?.isEmpty() ?? true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-medium text-slate-700 text-sm">{chapterTitle}</span>
          <span className="ml-auto text-sm text-slate-400">{current + 1}/{total}</span>
        </div>
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="bg-blue-50 rounded-2xl p-6 mb-4 text-center">
          <p className="text-sm text-blue-600 font-medium mb-2">Tiru tulisan di bawah ini</p>
          <div className="text-7xl font-bold text-slate-800 tracking-wide" style={{ fontFamily: 'sans-serif' }}>
            {ex.targetText}
          </div>
          {ex.hint && <p className="text-slate-500 text-sm mt-3">{ex.hint}</p>}
        </div>

        <DrawingPad ref={padRef} width={400} height={220} />

        {matchScore !== null && (
          <div className={`mt-3 rounded-xl p-3 text-center ${matchScore >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            Kecocokan tulisan: <strong>{matchScore}%</strong>
            {matchScore < 60 && ' - Coba tulis lagi lebih mirip ya!'}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => { padRef.current?.clear(); setTeacherApproved(false); setMatchScore(null); }}
            className="btn-secondary flex-1"
            disabled={isEmpty}
          >
            <Eraser className="w-5 h-5" /> Hapus
          </button>
          <button
            onClick={handleTeacherApprove}
            disabled={isEmpty}
            className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: isEmpty ? undefined : '#2563eb' }}
          >
            <CheckCircle2 className="w-5 h-5" /> Setujui
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-2">
          Tombol "Setujui" hanya bisa ditekan setelah kamu menggambar di kanvas.
        </p>

        {teacherApproved && (
          <button onClick={next} className="btn-primary w-full mt-4">
            {current + 1 >= total ? 'Lihat Hasil' : 'Latihan Berikutnya'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </main>
    </div>
  );
}

function renderTextToCanvas(text: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL('image/png');
}
