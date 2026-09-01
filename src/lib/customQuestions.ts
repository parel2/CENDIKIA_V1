import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type {
  BackupDoc,
  Chapter,
  CustomQuestionDoc,
  Module,
  QuizQuestion,
  WritingExercise,
} from '@/types';
import { CURRICULUM } from '@/curriculum';

const SOAL = 'soal_custom';
const BACKUP = 'soal_backup';
const UPDATES = 'chapter_updates';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  valid: CustomQuestionDoc[];
}

export const VALID_MODUL = ['berhitung', 'membaca', 'menulis'];

export function validateSoalJSON(raw: string): ValidationResult {
  const errors: string[] = [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ['JSON tidak valid. Periksa tanda kurung dan tanda kutip.'], valid: [] };
  }

  const arr = Array.isArray(parsed) ? parsed : [parsed];
  const valid: CustomQuestionDoc[] = [];

  arr.forEach((item, idx) => {
    const label = `Soal #${idx + 1}`;
    const r = item as Record<string, unknown>;
    if (!r || typeof r !== 'object') {
      errors.push(`${label}: bukan object valid.`);
      return;
    }
    if (typeof r.modul !== 'string' || !VALID_MODUL.includes(r.modul)) {
      errors.push(`${label}: "modul" harus salah satu dari ${VALID_MODUL.join(', ')}.`);
      return;
    }
    if (typeof r.kelas !== 'number' || r.kelas < 1 || r.kelas > 5) {
      errors.push(`${label}: "kelas" harus angka 1-5.`);
      return;
    }
    if (typeof r.level !== 'number' || r.level < 1 || r.level > 5) {
      errors.push(`${label}: "level" harus angka 1-5.`);
      return;
    }
    const tipe = r.tipe_soal as string;
    if (tipe !== 'pilihan_ganda' && tipe !== 'menulis') {
      errors.push(`${label}: "tipe_soal" harus "pilihan_ganda" atau "menulis".`);
      return;
    }

    if (tipe === 'pilihan_ganda') {
      if (typeof r.pertanyaan !== 'string' || !r.pertanyaan.trim()) {
        errors.push(`${label}: "pertanyaan" wajib diisi untuk pilihan_ganda.`);
        return;
      }
      if (!Array.isArray(r.pilihan) || r.pilihan.length < 2) {
        errors.push(`${label}: "pilihan" harus array minimal 2 pilihan.`);
        return;
      }
      if (typeof r.jawaban_benar !== 'string' || !r.jawaban_benar.trim()) {
        errors.push(`${label}: "jawaban_benar" wajib diisi.`);
        return;
      }
      const ans = String(r.jawaban_benar).trim();
      if (!(r.pilihan as string[]).map((p) => String(p).trim()).includes(ans)) {
        errors.push(`${label}: "jawaban_benar" tidak ada di dalam "pilihan".`);
        return;
      }
    } else {
      if (typeof r.target_tulisan !== 'string' || !r.target_tulisan.trim()) {
        errors.push(`${label}: "target_tulisan" wajib diisi untuk tipe menulis.`);
        return;
      }
    }

    valid.push({
      id: `${r.modul}_l${r.level}_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      modul: r.modul as string,
      kelas: r.kelas as number,
      level: r.level as number,
      tipe_soal: tipe as 'pilihan_ganda' | 'menulis',
      gaya_soal: (r.gaya_soal as 'biasa' | 'soal_cerita') ?? 'biasa',
      ilustrasi: typeof r.ilustrasi === 'string' ? r.ilustrasi : undefined,
      pertanyaan: typeof r.pertanyaan === 'string' ? r.pertanyaan : undefined,
      pilihan: Array.isArray(r.pilihan) ? (r.pilihan as string[]) : undefined,
      jawaban_benar: typeof r.jawaban_benar === 'string' ? r.jawaban_benar : undefined,
      penjelasan: typeof r.penjelasan === 'string' ? r.penjelasan : undefined,
      teks_bacaan: typeof r.teks_bacaan === 'string' ? r.teks_bacaan : undefined,
      target_tulisan: typeof r.target_tulisan === 'string' ? r.target_tulisan : undefined,
      hint: typeof r.hint === 'string' ? r.hint : undefined,
      target_pattern: typeof r.target_pattern === 'string' ? r.target_pattern : undefined,
      createdAt: Date.now(),
    });
  });

  return { ok: errors.length === 0, errors, valid };
}

export async function getCustomQuestions(): Promise<CustomQuestionDoc[]> {
  const snap = await getDocs(collection(db, SOAL));
  return snap.docs.map((d) => d.data() as CustomQuestionDoc);
}

export async function getCustomQuestionsByModule(modul: string): Promise<CustomQuestionDoc[]> {
  const q = query(collection(db, SOAL), where('modul', '==', modul));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as CustomQuestionDoc);
}

async function createBackup(label: string): Promise<BackupDoc> {
  const existing = await getCustomQuestions();
  const backup: BackupDoc = {
    id: `backup_${Date.now()}`,
    createdAt: Date.now(),
    label,
    data: existing,
  };
  await setDoc(doc(db, BACKUP, backup.id), backup);
  return backup;
}

export async function getBackups(): Promise<BackupDoc[]> {
  const snap = await getDocs(collection(db, BACKUP));
  return snap.docs
    .map((d) => d.data() as BackupDoc)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function appendSoal(docs: CustomQuestionDoc[]): Promise<BackupDoc> {
  const backup = await createBackup(`Sebelum append ${docs.length} soal`);
  for (const d of docs) {
    await setDoc(doc(db, SOAL, d.id), d);
  }
  return backup;
}

export async function replaceSoalAtLevel(
  modul: string,
  level: number,
  docs: CustomQuestionDoc[]
): Promise<BackupDoc> {
  const backup = await createBackup(`Sebelum ganti ${modul} level ${level}`);
  const q = query(collection(db, SOAL), where('modul', '==', modul), where('level', '==', level));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  for (const d of docs) {
    await setDoc(doc(db, SOAL, d.id), d);
  }
  return backup;
}

export async function restoreBackup(backupId: string): Promise<void> {
  const snap = await getDoc(doc(db, BACKUP, backupId));
  if (!snap.exists()) throw new Error('Backup tidak ditemukan.');
  const backup = snap.data() as BackupDoc;
  const all = await getDocs(collection(db, SOAL));
  await Promise.all(all.docs.map((d) => deleteDoc(d.ref)));
  for (const d of backup.data) {
    await setDoc(doc(db, SOAL, d.id), d);
  }
}

export async function markChapterUpdated(chapterId: string, label: string): Promise<void> {
  await setDoc(doc(db, UPDATES, chapterId), {
    chapterId,
    label,
    updatedAt: Date.now(),
  });
}

export async function getUpdatedChapterIds(): Promise<Set<string>> {
  const snap = await getDocs(collection(db, UPDATES));
  return new Set(snap.docs.map((d) => d.data().chapterId as string));
}

export async function clearChapterUpdate(chapterId: string): Promise<void> {
  await deleteDoc(doc(db, UPDATES, chapterId));
}

export function customToQuizQuestion(d: CustomQuestionDoc): QuizQuestion {
  const answerIndex = d.pilihan
    ? d.pilihan.findIndex((p) => p.trim() === String(d.jawaban_benar).trim())
    : 0;
  return {
    q: d.pertanyaan ?? '',
    options: d.pilihan ?? [],
    answer: answerIndex >= 0 ? answerIndex : 0,
    ilustrasi: d.ilustrasi,
    gayaSoal: d.gaya_soal ?? 'biasa',
    teksBacaan: d.teks_bacaan,
    penjelasan: d.penjelasan,
  };
}

export function customToWritingExercise(d: CustomQuestionDoc): WritingExercise {
  return {
    targetText: d.target_tulisan ?? '',
    targetPattern: d.target_pattern ?? d.target_tulisan,
    hint: d.hint,
  };
}

export function mergeCustomIntoCurriculum(custom: CustomQuestionDoc[]): Module[] {
  const merged: Module[] = JSON.parse(JSON.stringify(CURRICULUM));
  const byModuleLevel = new Map<string, CustomQuestionDoc[]>();
  for (const d of custom) {
    const key = `${d.modul}_${d.level}`;
    if (!byModuleLevel.has(key)) byModuleLevel.set(key, []);
    byModuleLevel.get(key)!.push(d);
  }

  for (const m of merged) {
    for (const lv of m.levels) {
      const key = `${m.id}_${lv.level}`;
      const customs = byModuleLevel.get(key);
      if (!customs) continue;

      const quizQs = customs.filter((d) => d.tipe_soal === 'pilihan_ganda').map(customToQuizQuestion);
      const writeExs = customs.filter((d) => d.tipe_soal === 'menulis').map(customToWritingExercise);

      if (quizQs.length > 0) {
        const existing = lv.chapters.find((c) => c.id === `${m.id[0]}${lv.level}custom`);
        if (existing && existing.questions) {
          existing.questions.push(...quizQs);
        } else {
          lv.chapters.push({
            id: `${m.id[0]}${lv.level}custom`,
            title: `Soal Tambahan`,
            type: 'kuis',
            questions: quizQs,
          });
        }
      }

      if (writeExs.length > 0) {
        const existing = lv.chapters.find((c) => c.id === `${m.id[0]}${lv.level}customw`);
        if (existing && existing.writing) {
          existing.writing.push(...writeExs);
        } else {
          lv.chapters.push({
            id: `${m.id[0]}${lv.level}customw`,
            title: `Latihan Menulis Tambahan`,
            type: 'menulis',
            writing: writeExs,
          });
        }
      }
    }
  }
  return merged;
}

export async function getMergedCurriculum(): Promise<Module[]> {
  try {
    const custom = await getCustomQuestions();
    return mergeCustomIntoCurriculum(custom);
  } catch {
    return CURRICULUM;
  }
}

export function chaptersContainingCustom(custom: CustomQuestionDoc[], modules: Module[]): Chapter[] {
  const result: Chapter[] = [];
  for (const m of modules) {
    for (const lv of m.levels) {
      for (const ch of lv.chapters) {
        if (ch.id.endsWith('custom') || ch.id.endsWith('customw')) {
          result.push(ch);
        }
      }
    }
  }
  return result;
}
