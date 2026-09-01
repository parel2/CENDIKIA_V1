import { useEffect, useState } from 'react';
import {
  BookOpen,
  Calculator,
  ChevronRight,
  Home,
  LogOut,
  PenLine,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import type { Chapter, Module as ModuleType } from '@/types';
import { CURRICULUM } from '@/curriculum';
import { useAuth } from '@/context/AuthContext';
import { saveQuizResult, markChapterSeen, refreshUser } from '@/lib/firestore';
import { getMergedCurriculum, getUpdatedChapterIds, clearChapterUpdate } from '@/lib/customQuestions';
import QuizView from './QuizView';
import WritingExerciseView from './WritingExerciseView';

const ICONS: Record<string, LucideIcon> = { BookOpen, PenLine, Calculator };

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; soft: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-300', soft: 'bg-emerald-50' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-300', soft: 'bg-blue-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300', soft: 'bg-amber-50' },
};

type View =
  | { name: 'home' }
  | { name: 'module'; moduleId: string }
  | { name: 'chapter'; moduleId: string; chapter: Chapter; chapterIndex: { level: number; chIndex: number; total: number } }
  | { name: 'quiz'; moduleId: string; chapter: Chapter }
  | { name: 'writing'; moduleId: string; chapter: Chapter };

export default function StudentHome() {
  const { user, logout, updateUser } = useAuth();
  const [view, setView] = useState<View>({ name: 'home' });
  const [curriculum, setCurriculum] = useState<ModuleType[]>(CURRICULUM);
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMergedCurriculum(), getUpdatedChapterIds()])
      .then(([merged, ids]) => {
        setCurriculum(merged);
        setUpdatedIds(ids);
      })
      .catch(() => setCurriculum(CURRICULUM))
      .finally(() => setLoading(false));
  }, []);

  const seenSet = new Set(user?.seenChapters ?? []);
  const hasNew = [...updatedIds].some((id) => !seenSet.has(id));

  async function handleOpenChapter(chapter: Chapter, moduleId: string) {
    if (updatedIds.has(chapter.id) && user) {
      await markChapterSeen(user.uid, chapter.id);
      await clearChapterUpdate(chapter.id);
      const fresh = await refreshUser(user.uid);
      if (fresh) updateUser(fresh);
      setUpdatedIds((prev) => {
        const next = new Set(prev);
        next.delete(chapter.id);
        return next;
      });
    }
    if (chapter.type === 'menulis') {
      setView({ name: 'writing', moduleId, chapter });
    } else {
      setView({ name: 'quiz', moduleId, chapter });
    }
  }

  if (view.name === 'quiz') {
    return (
      <QuizView
        chapter={view.chapter}
        onBack={() => setView({ name: 'module', moduleId: view.moduleId })}
        onComplete={async (score) => {
          if (user) await saveQuizResult(user.uid, view.chapter.id, score);
          setView({ name: 'home' });
        }}
      />
    );
  }

  if (view.name === 'writing') {
    return (
      <WritingExerciseView
        exercises={view.chapter.writing ?? []}
        chapterTitle={view.chapter.title}
        onBack={() => setView({ name: 'module', moduleId: view.moduleId })}
        onComplete={async (score) => {
          if (user) await saveQuizResult(user.uid, view.chapter.id, score);
          setView({ name: 'home' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(view.name === 'module' || view.name === 'chapter') && (
              <button onClick={() => setView({ name: 'home' })} className="p-2 -ml-2 rounded-lg hover:bg-slate-100">
                <Home className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <span className="font-bold text-slate-800 text-lg">Les Calistung</span>
            {hasNew && (
              <span className="relative inline-flex ml-1">
                <Bell className="w-5 h-5 text-amber-500" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">Halo, {user?.nama}</span>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Keluar">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : (
          <>
            {view.name === 'home' && <HomeView user={user} onOpenModule={(id) => setView({ name: 'module', moduleId: id })} />}
            {view.name === 'module' && (
              <ModuleView
                mod={curriculum.find((m) => m.id === view.moduleId)!}
                progress={user?.progress}
                updatedIds={updatedIds}
                onBack={() => setView({ name: 'home' })}
                onOpenChapter={(chapter, idx) => setView({ name: 'chapter', moduleId: view.moduleId, chapter, chapterIndex: idx })}
              />
            )}
            {view.name === 'chapter' && (
              <ChapterView
                mod={curriculum.find((m) => m.id === view.moduleId)!}
                chapter={view.chapter}
                idx={view.chapterIndex}
                progress={user?.progress?.[view.chapter.id]}
                onBack={() => setView({ name: 'module', moduleId: view.moduleId })}
                onStart={() => handleOpenChapter(view.chapter, view.moduleId)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function HomeView({ user, onOpenModule }: { user: ReturnType<typeof useAuth>['user']; onOpenModule: (id: string) => void }) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Selamat datang, {user?.nama}!</h1>
        <p className="text-slate-500 mt-1">Pilih pelajaran yang ingin kamu pelajari hari ini.</p>
        {user?.kelas && <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">Kelas {user.kelas}</span>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {CURRICULUM.map((m) => {
          const Icon = ICONS[m.icon] ?? BookOpen;
          const c = COLOR_MAP[m.color];
          return (
            <button key={m.id} onClick={() => onOpenModule(m.id)} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-slate-200 text-left">
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${c.soft} mb-4`}>
                <Icon className={`w-7 h-7 ${c.text}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{m.title}</h3>
              <p className="text-sm text-slate-500 mt-1">5 level, banyak bab</p>
              <div className={`inline-flex items-center gap-1 mt-3 text-sm font-medium ${c.text}`}>
                Mulai <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function ModuleView({ mod, progress, updatedIds, onBack, onOpenChapter }: {
  mod: ModuleType;
  progress?: Record<string, { bestScore: number; lastScore: number; attempts: number; lastPlayed: number }>;
  updatedIds: Set<string>;
  onBack: () => void;
  onOpenChapter: (chapter: Chapter, idx: { level: number; chIndex: number; total: number }) => void;
}) {
  const Icon = ICONS[mod.icon] ?? BookOpen;
  const c = COLOR_MAP[mod.color];
  return (
    <>
      <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-4 text-sm">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <div className={`rounded-2xl p-6 mb-6 ${c.soft}`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm`}>
            <Icon className={`w-7 h-7 ${c.text}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{mod.title}</h1>
            <p className="text-slate-600 text-sm">Pilih level dan bab untuk mulai</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {mod.levels.map((lv) => (
          <div key={lv.level} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className={`px-4 py-2 ${c.bg} text-white font-medium text-sm flex items-center justify-between`}>
              <span>Level {lv.level}</span>
              <span className="opacity-80">{lv.title}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {lv.chapters.map((ch, i) => {
                const p = progress?.[ch.id];
                const isNew = updatedIds.has(ch.id);
                const isWriting = ch.type === 'menulis';
                const count = isWriting ? (ch.writing?.length ?? 0) : (ch.questions?.length ?? 0);
                return (
                  <button key={ch.id} onClick={() => onOpenChapter(ch, { level: lv.level, chIndex: i, total: lv.chapters.length })} className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-left">
                    <div className="flex items-center gap-2">
                      {isNew && <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0" title="Soal baru" />}
                      <div>
                        <div className="font-medium text-slate-800">{lv.level}.{i + 1} {ch.title}</div>
                        <div className="text-xs text-slate-400">{count} {isWriting ? 'latihan' : 'soal'}{isWriting ? ' menulis' : ' pilihan ganda'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.bestScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.bestScore}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ChapterView({ mod, chapter, idx, progress, onBack, onStart }: {
  mod: ModuleType;
  chapter: Chapter;
  idx: { level: number; chIndex: number; total: number };
  progress?: { bestScore: number; lastScore: number; attempts: number; lastPlayed: number };
  onBack: () => void;
  onStart: () => void;
}) {
  const c = COLOR_MAP[mod.color];
  const isWriting = chapter.type === 'menulis';
  const count = isWriting ? (chapter.writing?.length ?? 0) : (chapter.questions?.length ?? 0);
  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-4 text-sm">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${c.soft} ${c.text} mb-3`}>
          {mod.title} - Level {idx.level}
        </span>
        <h2 className="text-2xl font-bold text-slate-800">{chapter.title}</h2>
        <p className="text-slate-500 mt-2">{count} {isWriting ? 'latihan menulis' : 'soal pilihan ganda'}</p>

        {progress && (
          <div className="grid grid-cols-3 gap-2 mt-6">
            <Stat label="Skor Terbaik" value={`${progress.bestScore}`} />
            <Stat label="Skor Terakhir" value={`${progress.lastScore}`} />
            <Stat label="Total Coba" value={`${progress.attempts}`} />
          </div>
        )}

        <button onClick={onStart} className={`btn-primary w-full mt-6 ${c.bg}`}>
          <CheckCircle2 className="w-5 h-5" /> {isWriting ? 'Mulai Menulis' : 'Mulai Kuis'}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="text-xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
