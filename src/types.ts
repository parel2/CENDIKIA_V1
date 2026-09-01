export type Role = 'siswa' | 'guru';

export interface UserProfile {
  uid: string;
  nama: string;
  role: Role;
  passwordHash: string;
  createdAt: number;
  kelas?: number;
  progress?: Record<string, ChapterProgress>;
  seenChapters?: string[];
  isGuru?: true;
}

export interface ChapterProgress {
  bestScore: number;
  lastScore: number;
  attempts: number;
  lastPlayed: number;
}

export type GayaSoal = 'biasa' | 'soal_cerita';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  ilustrasi?: string;
  gayaSoal?: GayaSoal;
  teksBacaan?: string;
  penjelasan?: string;
}

export interface WritingExercise {
  targetText: string;
  hint?: string;
  targetPattern?: string;
}

export type ChapterType = 'kuis' | 'menulis';

export interface Chapter {
  id: string;
  title: string;
  type?: ChapterType;
  questions?: QuizQuestion[];
  writing?: WritingExercise[];
}

export interface Level {
  level: number;
  title: string;
  chapters: Chapter[];
}

export interface Module {
  id: 'membaca' | 'menulis' | 'berhitung';
  title: string;
  icon: string;
  color: string;
  levels: Level[];
}

export interface CustomQuestionDoc {
  id: string;
  modul: string;
  kelas: number;
  level: number;
  tipe_soal: 'pilihan_ganda' | 'menulis';
  gaya_soal?: GayaSoal;
  ilustrasi?: string;
  pertanyaan?: string;
  pilihan?: string[];
  jawaban_benar?: string;
  penjelasan?: string;
  teks_bacaan?: string;
  target_tulisan?: string;
  hint?: string;
  target_pattern?: string;
  createdAt: number;
}

export interface BackupDoc {
  id: string;
  createdAt: number;
  label: string;
  data: CustomQuestionDoc[];
}
