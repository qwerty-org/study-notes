/**
 * Lokal saqlash adapteri (docs/03-architecture.md).
 * Hozir: localStorage. Keyin: SQLite (Tauri/Electron) — interfeys bir xil.
 */
import type {
  AIConfig,
  ApplyLogEntry,
  BookRecord,
  OnboardingState,
  Profile,
  Review,
} from './types'
import { localDay } from './date'

const K = {
  profile: 'sn.profile',
  ai: 'sn.aiConfig',
  library: 'sn.library',
  reviews: 'sn.reviews',
  applyLog: 'sn.applyLog',
  onboarding: 'sn.onboarding',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const store = {
  getProfile: (): Profile =>
    load<Profile>(K.profile, {
      name: '',
      avatar: '🦊',
      streak: 0,
      language: 'uz',
      theme: 'light',
      onboarded: false,
    }),
  setProfile: (p: Profile) => save(K.profile, p),

  getAI: (): AIConfig =>
    load<AIConfig>(K.ai, { provider: 'gemini', apiKey: '', model: '' }),
  setAI: (c: AIConfig) => save(K.ai, c),

  getLibrary: (): BookRecord[] => load<BookRecord[]>(K.library, []),
  setLibrary: (lib: BookRecord[]) => save(K.library, lib),

  getReviews: (): Review[] => load<Review[]>(K.reviews, []),
  setReviews: (r: Review[]) => save(K.reviews, r),

  getApplyLog: (): ApplyLogEntry[] => load<ApplyLogEntry[]>(K.applyLog, []),
  setApplyLog: (l: ApplyLogEntry[]) => save(K.applyLog, l),

  getOnboarding: (): OnboardingState =>
    load<OnboardingState>(K.onboarding, { step: 0, done: false }),
  setOnboarding: (o: OnboardingState) => save(K.onboarding, o),

  /** Eksport/import (Sozlamalar) */
  exportAll: () =>
    JSON.stringify(
      {
        app: 'study-notes',
        version: 1,
        exportedAt: new Date().toISOString(),
        profile: store.getProfile(),
        ai: { ...store.getAI(), apiKey: '' },
        library: store.getLibrary(),
        reviews: store.getReviews(),
        applyLog: store.getApplyLog(),
      },
      null,
      2,
    ),
  importAll: (json: string): boolean => {
    try {
      const data = JSON.parse(json)
      if (data.app !== 'study-notes') return false
      if (data.profile) store.setProfile(data.profile)
      if (data.library) store.setLibrary(data.library)
      if (data.reviews) store.setReviews(data.reviews)
      if (data.applyLog) store.setApplyLog(data.applyLog)
      return true
    } catch {
      return false
    }
  },
  clearAll: () => Object.values(K).forEach((k) => localStorage.removeItem(k)),
}

/* ---------- Streak (har faol kun) ---------- */

export function touchActiveDay(profile: Profile): Profile {
  const today = localDay()
  if (profile.lastActive === today) return profile
  const yesterday = localDay(new Date(Date.now() - 86400000))
  const streak = profile.lastActive === yesterday ? profile.streak + 1 : 1
  return { ...profile, streak, lastActive: today }
}

/* ---------- Kitob yordamchilari ---------- */

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9а-яёқғҳў]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'kitob'
  )
}

export function emptyProgress() {
  return {
    percent: 0,
    currentChapter: 0,
    readChapters: [],
    quizCorrect: 0,
    quizTotal: 0,
  }
}
