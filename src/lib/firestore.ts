import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  arrayUnion,
} from 'firebase/firestore';
import type {
  ChapterProgress,
  UserProfile,
} from '@/types';
import { db } from '@/firebase';
import { hashPassword } from '@/lib/hash';

const USERS = 'users';
const NAMES = 'names';

export interface LoginResult {
  profile: UserProfile;
  isNew: boolean;
}

async function resolveUid(role: string, nama: string): Promise<string> {
  const slug = nama.trim().toLowerCase();
  const namesDoc = await getDoc(doc(db, NAMES, `${role}_${slug}`));
  if (namesDoc.exists()) return namesDoc.data().uid as string;
  return `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function loginSiswa(
  nama: string,
  password: string,
  kelas: number
): Promise<LoginResult> {
  const uid = await resolveUid('siswa', nama);
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    const pwHash = await hashPassword(password);
    if (data.passwordHash !== pwHash) {
      throw new Error('Password salah. Coba lagi.');
    }
    return { profile: data, isNew: false };
  }

  const profile: UserProfile = {
    uid,
    nama: nama.trim(),
    role: 'siswa',
    passwordHash: await hashPassword(password),
    createdAt: Date.now(),
    kelas,
    progress: {},
    seenChapters: [],
  };
  await setDoc(ref, profile);
  await setDoc(doc(db, NAMES, `siswa_${nama.trim().toLowerCase()}`), { uid });
  return { profile, isNew: true };
}

export async function loginGuru(
  nama: string,
  password: string,
  oktena: string
): Promise<LoginResult> {
  if (oktena !== 'n2oktena_3030') {
    throw new Error('Kode Oktena salah. Akses guru ditolak.');
  }
  const uid = await resolveUid('guru', nama);
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    const pwHash = await hashPassword(password);
    if (data.passwordHash !== pwHash) {
      throw new Error('Password salah. Coba lagi.');
    }
    return { profile: data, isNew: false };
  }

  const profile: UserProfile = {
    uid,
    nama: nama.trim(),
    role: 'guru',
    passwordHash: await hashPassword(password),
    createdAt: Date.now(),
    isGuru: true,
  };
  await setDoc(ref, profile);
  await setDoc(doc(db, NAMES, `guru_${nama.trim().toLowerCase()}`), { uid });
  return { profile, isNew: true };
}

export async function getAllSiswa(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), where('role', '==', 'siswa'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function saveQuizResult(
  uid: string,
  chapterId: string,
  score: number
): Promise<void> {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserProfile;
  const progress = data.progress ?? {};
  const prev = progress[chapterId];
  const next: ChapterProgress = {
    bestScore: prev ? Math.max(prev.bestScore, score) : score,
    lastScore: score,
    attempts: prev ? prev.attempts + 1 : 1,
    lastPlayed: Date.now(),
  };
  progress[chapterId] = next;
  await updateDoc(ref, { progress });
}

export async function markChapterSeen(uid: string, chapterId: string): Promise<void> {
  const ref = doc(db, USERS, uid);
  await updateDoc(ref, { seenChapters: arrayUnion(chapterId) });
}

export async function refreshUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}
