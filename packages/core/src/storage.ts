/**
 * Lokal saqlash adapteri (docs/03-architecture.md).
 * Hozir: localStorage. Keyin: SQLite (Tauri/Electron) — interfeys bir xil.
 *
 * Saqlangan ma'lumot har doim "ishonchsiz" deb hisoblanadi: eski versiya,
 * qisman yozilgan yoki buzilgan JSON bo'lishi mumkin. Shuning uchun o'qish
 * har doim standart qiymatlar bilan to'ldiradigan sanitizatsiyadan o'tadi.
 */
import type {
  AIConfig,
  ApplyLogEntry,
  ApplyScenario,
  BookAnalysis,
  BookMeta,
  BookProgress,
  BookRecord,
  ChapterAnalysis,
  OnboardingState,
  Profile,
  QuizItem,
  ReaderPrefs,
  Review,
  SavedHighlight,
} from './types'
import { addLocalDays, localDay } from './date'

const K = {
  profile: 'sn.profile',
  ai: 'sn.aiConfig',
  library: 'sn.library',
  reviews: 'sn.reviews',
  applyLog: 'sn.applyLog',
  onboarding: 'sn.onboarding',
} as const

/** Eksport formati versiyasi; undan eski fayllar ham o'qiladi. */
const SCHEMA_VERSION = 1

/* ---------- Tolerant parsing yordamchilari ---------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v)
    ? (v as T)
    : fallback
}

/** Manfiy/kasr/NaN qiymatlarni xavfsiz butun songa keltiradi. */
function whole(v: unknown, fallback: number, min = 0): number {
  return Math.max(min, Math.floor(num(v) ?? fallback))
}

/* ---------- Standart qiymatlar ---------- */

const defaultProfile: Profile = {
  name: '',
  avatar: '🦊',
  streak: 0,
  language: 'uz',
  theme: 'light',
  onboarded: false,
}

const defaultAI: AIConfig = { provider: 'gemini', apiKey: '', model: '' }

const defaultOnboarding: OnboardingState = { step: 0, done: false }

/* ---------- Sanitizatorlar: har qanday unknown -> to'g'ri shakl ---------- */

function sanitizeProfile(v: unknown): Profile {
  const o = isRecord(v) ? v : {}
  const lastActive = str(o.lastActive)
  return {
    ...o,
    name: str(o.name) ?? defaultProfile.name,
    avatar: str(o.avatar) ?? defaultProfile.avatar,
    streak: whole(o.streak, 0),
    language: 'uz',
    theme: oneOf(o.theme, ['dark', 'light'] as const, defaultProfile.theme),
    onboarded: typeof o.onboarded === 'boolean' ? o.onboarded : false,
    ...(lastActive ? { lastActive } : {}),
  } as Profile
}

function sanitizeAI(v: unknown): AIConfig {
  const o = isRecord(v) ? v : {}
  return {
    ...o,
    provider: oneOf(
      o.provider,
      ['gemini', 'openai', 'ollama'] as const,
      defaultAI.provider as AIConfig['provider'],
    ),
    apiKey: str(o.apiKey) ?? '',
    model: str(o.model) ?? defaultAI.model ?? '',
  } as AIConfig
}

function sanitizeReader(v: unknown): ReaderPrefs | undefined {
  if (!isRecord(v)) return undefined
  return {
    fontSize: Math.max(6, num(v.fontSize) ?? 16),
    paper: oneOf(v.paper, ['paper', 'sepia'] as const, 'paper'),
  }
}

function sanitizeHighlights(v: unknown): SavedHighlight[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: SavedHighlight[] = []
  for (const item of v) {
    if (!isRecord(item)) continue
    const id = str(item.id)
    const text = str(item.text)
    if (!id || text === undefined) continue
    out.push({
      id,
      text,
      chapter: whole(item.chapter, 0),
      page: whole(item.page, 0),
    })
  }
  return out
}

function sanitizeProgress(v: unknown): BookProgress {
  const o = isRecord(v) ? v : {}
  const reader = sanitizeReader(o.reader)
  const highlights = sanitizeHighlights(o.highlights)
  const currentPage = num(o.currentPage)
  return {
    ...o,
    percent: Math.min(100, whole(o.percent, 0)),
    currentChapter: whole(o.currentChapter, 0),
    readChapters: arr(o.readChapters).filter(
      (n): n is number => typeof n === 'number' && Number.isFinite(n),
    ),
    quizCorrect: whole(o.quizCorrect, 0),
    quizTotal: whole(o.quizTotal, 0),
    ...(currentPage !== undefined ? { currentPage: whole(currentPage, 0) } : {}),
    ...(reader ? { reader } : {}),
    ...(highlights ? { highlights } : {}),
  } as BookProgress
}

function sanitizeMeta(v: unknown): BookMeta | null {
  if (!isRecord(v)) return null
  const title = str(v.title)
  const slug = str(v.slug) || slugify(title ?? '')
  const author = str(v.author)
  const language = str(v.language)
  const analysisVersion = num(v.analysisVersion)
  const rulesVersion = str(v.rulesVersion)
  return {
    ...v,
    slug,
    title: title ?? slug,
    ...(author ? { author } : {}),
    ...(language ? { language } : {}),
    sourceFormat: oneOf(v.sourceFormat, ['md', 'txt', 'pdf', 'epub'] as const, 'md'),
    chapters: whole(v.chapters, 0),
    status: oneOf(
      v.status,
      ['imported', 'analyzing', 'analyzed', 'partial'] as const,
      'imported',
    ),
    ...(analysisVersion !== undefined ? { analysisVersion } : {}),
    ...(rulesVersion ? { rulesVersion } : {}),
    addedAt: str(v.addedAt) ?? new Date().toISOString(),
  } as BookMeta
}

function sanitizeAnalysis(v: unknown): BookAnalysis | undefined {
  if (!isRecord(v)) return undefined
  return {
    ...v,
    book: str(v.book) ?? '',
    rulesVersion: str(v.rulesVersion) ?? '',
    analyzedAt: str(v.analyzedAt) ?? new Date().toISOString(),
    chapters: arr(v.chapters) as ChapterAnalysis[],
    quizzes: arr(v.quizzes) as QuizItem[],
    scenarios: arr(v.scenarios) as ApplyScenario[],
  } as BookAnalysis
}

function sanitizeBook(v: unknown): BookRecord | null {
  const meta = sanitizeMeta(isRecord(v) ? v.meta : undefined)
  if (!meta) return null
  const o = v as Record<string, unknown>
  const analysis = sanitizeAnalysis(o.analysis)
  return {
    ...o,
    meta,
    content: str(o.content) ?? '',
    progress: sanitizeProgress(o.progress),
    ...(analysis ? { analysis } : {}),
  } as BookRecord
}

function sanitizeLibrary(v: unknown): BookRecord[] {
  if (!Array.isArray(v)) return []
  const out: BookRecord[] = []
  for (const item of v) {
    const book = sanitizeBook(item)
    if (book) out.push(book)
  }
  return out
}

function sanitizeReviews(v: unknown): Review[] {
  if (!Array.isArray(v)) return []
  const out: Review[] = []
  for (const item of v) {
    if (!isRecord(item)) continue
    const reviewId = str(item.reviewId)
    if (!reviewId) continue
    const ease = num(item.ease)
    out.push({
      ...item,
      reviewId,
      book: str(item.book) ?? '',
      type: oneOf(item.type, ['quiz', 'idea'] as const, 'quiz'),
      dueDate: str(item.dueDate) ?? localDay(),
      interval: whole(item.interval, 0),
      ease: ease !== undefined && ease > 0 ? ease : 2.5,
      reps: whole(item.reps, 0),
      lapses: whole(item.lapses, 0),
      state: oneOf(item.state, ['new', 'learning', 'review'] as const, 'new'),
    } as Review)
  }
  return out
}

function sanitizeApplyLog(v: unknown): ApplyLogEntry[] {
  if (!Array.isArray(v)) return []
  const out: ApplyLogEntry[] = []
  for (const item of v) {
    if (!isRecord(item)) continue
    const id = str(item.id)
    if (!id) continue
    const note = str(item.note)
    const context = str(item.context)
    const refId = str(item.refId)
    const kind = oneOf(item.kind, ['idea', 'scenario'] as const, 'idea')
    out.push({
      ...item,
      id,
      book: str(item.book) ?? '',
      ideaId: str(item.ideaId) ?? id,
      date: str(item.date) ?? localDay(),
      ...(note !== undefined ? { note } : {}),
      ...(context !== undefined ? { context } : {}),
      ...(item.kind !== undefined ? { kind } : {}),
      ...(refId !== undefined ? { refId } : {}),
    } as ApplyLogEntry)
  }
  return out
}

function sanitizeOnboarding(v: unknown): OnboardingState {
  const o = isRecord(v) ? v : {}
  return {
    ...o,
    step: whole(o.step, 0),
    done: typeof o.done === 'boolean' ? o.done : false,
  } as OnboardingState
}

/* ---------- Asosiy o'qish/yozish ---------- */

/**
 * O'qish hech qachon tashlamaydi: kalit yo'q, JSON buzilgan yoki shakl eski
 * bo'lsa ham standart qiymat qaytariladi.
 */
function load<T>(key: string, fallback: T, sanitize: (v: unknown) => T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return sanitize(JSON.parse(raw) as unknown)
  } catch {
    return fallback
  }
}

/** Avval to'liq serialized qilamiz — yarim yozilgan qiymat chiqmaydi. */
function save(key: string, value: unknown): void {
  const payload = JSON.stringify(value)
  localStorage.setItem(key, payload)
}

export const store = {
  getProfile: (): Profile =>
    load<Profile>(K.profile, { ...defaultProfile }, sanitizeProfile),
  setProfile: (p: Profile) => save(K.profile, p),

  getAI: (): AIConfig => load<AIConfig>(K.ai, { ...defaultAI }, sanitizeAI),
  setAI: (c: AIConfig) => save(K.ai, c),

  getLibrary: (): BookRecord[] => load<BookRecord[]>(K.library, [], sanitizeLibrary),
  setLibrary: (lib: BookRecord[]) => save(K.library, lib),

  getReviews: (): Review[] => load<Review[]>(K.reviews, [], sanitizeReviews),
  setReviews: (r: Review[]) => save(K.reviews, r),

  getApplyLog: (): ApplyLogEntry[] => load<ApplyLogEntry[]>(K.applyLog, [], sanitizeApplyLog),
  setApplyLog: (l: ApplyLogEntry[]) => save(K.applyLog, l),

  getOnboarding: (): OnboardingState =>
    load<OnboardingState>(K.onboarding, { ...defaultOnboarding }, sanitizeOnboarding),
  setOnboarding: (o: OnboardingState) => save(K.onboarding, o),

  /** Eksport/import (Sozlamalar) */
  exportAll: () =>
    JSON.stringify(
      {
        app: 'study-notes',
        version: SCHEMA_VERSION,
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
    let data: unknown
    try {
      data = JSON.parse(json)
    } catch {
      return false
    }
    if (!isRecord(data) || data.app !== 'study-notes') return false

    // Avval barcha qiymatlarni tayyorlaymiz — hech narsa yozilmaydi.
    const entries: Array<[string, string]> = []
    try {
      if (data.profile !== undefined && data.profile !== null)
        entries.push([K.profile, JSON.stringify(sanitizeProfile(data.profile))])
      if (data.library !== undefined && data.library !== null)
        entries.push([K.library, JSON.stringify(sanitizeLibrary(data.library))])
      if (data.reviews !== undefined && data.reviews !== null)
        entries.push([K.reviews, JSON.stringify(sanitizeReviews(data.reviews))])
      if (data.applyLog !== undefined && data.applyLog !== null)
        entries.push([K.applyLog, JSON.stringify(sanitizeApplyLog(data.applyLog))])
    } catch {
      return false
    }

    // Eski qiymatlarning snapshoti: yozish xatosida qaytarib o'rnatiladi.
    let previous: Array<{ key: string; raw: string | null }> = []
    try {
      previous = entries.map(([key]) => ({ key, raw: localStorage.getItem(key) }))
    } catch {
      previous = []
    }

    try {
      for (const [key, payload] of entries) localStorage.setItem(key, payload)
      return true
    } catch {
      for (const { key, raw } of previous) {
        try {
          if (raw === null) localStorage.removeItem(key)
          else localStorage.setItem(key, raw)
        } catch {
          // storage ishlamasa, qaytarib o'rnatib bo'lmaydi — jim o'tkazamiz
        }
      }
      return false
    }
  },
  clearAll: () => {
    for (const k of Object.values(K)) {
      try {
        localStorage.removeItem(k)
      } catch {
        // storage ishlamasa xatolik tashlamaymiz
      }
    }
  },
}

/* ---------- Streak (har faol kun) ---------- */

export function touchActiveDay(profile: Profile): Profile {
  const today = localDay()
  if (profile.lastActive === today) return profile
  const yesterday = localDay(addLocalDays(-1))
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
