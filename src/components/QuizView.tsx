import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Home, RotateCcw, Award, BookOpen, Lightbulb } from 'lucide-react';
import type { Chapter } from '@/types';

interface Props {
  chapter: Chapter;
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function QuizView({ chapter, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);

  const questions = chapter.questions ?? [];
  const q = questions[current];
  const total = questions.length;

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
  }

  function next() {
    const updated = [...answers, selected!];
    setAnswers(updated);
    setSelected(null);
    setShowResult(false);
    setShowExplanation(false);
    if (current + 1 >= total) {
      const correct = updated.filter((a, idx) => a === questions[idx].answer).length;
      const score = Math.round((correct / total) * 100);
      setDone(true);
      onComplete(score);
    } else {
      setCurrent(current + 1);
    }
  }

  if (done) {
    const correct = answers.filter((a, idx) => a === questions[idx].answer).length;
    const score = Math.round((correct / total) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${score >= 70 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <Award className={`w-10 h-10 ${score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Kuis Selesai!</h2>
          <div className="text-5xl font-bold my-4 text-slate-800">{score}</div>
          <p className="text-slate-500">Jawaban benar: {correct} dari {total}</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setShowResult(false); setShowExplanation(false); setDone(false); }} className="btn-secondary flex-1">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-medium text-slate-700 text-sm">{chapter.title}</span>
          <span className="ml-auto text-sm text-slate-400">{current + 1}/{total}</span>
        </div>
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {q.gayaSoal === 'soal_cerita' && (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Soal Cerita
          </div>
        )}

        {q.teksBacaan && (
          <div className="bg-emerald-50 rounded-2xl p-5 mb-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Baca dengan teliti</span>
            </div>
            <p className="text-2xl leading-relaxed text-slate-800 font-medium" style={{ lineHeight: '1.8' }}>
              {q.teksBacaan}
            </p>
          </div>
        )}

        {q.ilustrasi && (
          <div className="bg-amber-50 rounded-2xl p-6 mb-5 text-center border border-amber-100">
            <div className="text-5xl sm:text-6xl tracking-wider">{q.ilustrasi}</div>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{q.q}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.answer;
            let cls = 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm';
            if (showResult) {
              if (isCorrect) cls = 'bg-emerald-50 border-emerald-400';
              else if (isSelected) cls = 'bg-red-50 border-red-400';
              else cls = 'bg-white border-slate-200 opacity-60';
            }
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${cls}`}
              >
                <span className="text-slate-800 text-lg">{opt}</span>
                {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>

        {showResult && q.penjelasan && (
          <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-blue-700">Penjelasan</span>
                <p className="text-slate-700 mt-1">{q.penjelasan}</p>
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <button onClick={next} className="btn-primary w-full mt-6">
            {current + 1 >= total ? 'Lihat Hasil' : 'Soal Berikutnya'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </main>
    </div>
  );
}
