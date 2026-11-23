import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  addLocalDays,
  emptyProgress,
  localDay,
  store,
  touchActiveDay,
  type AIConfig,
  type ApplyLogEntry,
  type BookRecord,
  type OnboardingState,
  type Profile,
  type Review,
} from '@study-notes/core'
import { DEMO_BOOK } from '../seed'

const SEEDED_KEY = 'sn.seeded'

/** Xususiy rejim/sandboxda localStorage butunlay ishlamasligi mumkin — hech qachon tashlamaymiz. */
function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* yozib bo'lmasa, faqat xotiradagi holat bilan ishlaymiz */
  }
}

function read<T>(get: () => T): T | null {
  try {
    return get()
  } catch {
    return null
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

const DEFAULT_PROFILE: Profile = {
  name: '',
  avatar: '🦊',
  streak: 0,
  language: 'uz',
  theme: 'light',
  onboarded: false,
}
const DEFAULT_AI: AIConfig = { provider: 'gemini', apiKey: '', model: '' }
const DEFAULT_ONBOARDING: OnboardingState = { step: 0, done: false }

/** JSON to'g'ri bo'lsa-da, tuzilma buzilgan bo'lishi mumkin — faqat yaroqli fieldlarni olamiz. */
function hydrateProfile(): Profile {
  const raw = read(store.getProfile)
  if (
    !isRecord(raw) ||
    typeof raw.name !== 'string' ||
    typeof raw.streak !== 'number' ||
    (raw.theme !== 'light' && raw.theme !== 'dark')
  ) {
    return { ...DEFAULT_PROFILE }
  }
  return {
    name: raw.name,
    avatar: typeof raw.avatar === 'string' ? raw.avatar : DEFAULT_PROFILE.avatar,
    streak: raw.streak,
    language: 'uz',
    theme: raw.theme,
    onboarded: raw.onboarded === true,
    ...(typeof raw.lastActive === 'string' ? { lastActive: raw.lastActive } : {}),
  }
}

function hydrateAI(): AIConfig {
  const raw = read(store.getAI)
  if (
    !isRecord(raw) ||
    typeof raw.apiKey !== 'string' ||
    (raw.provider !== 'gemini' && raw.provider !== 'openai' && raw.provider !== 'ollama')
  ) {
    return { ...DEFAULT_AI }
  }
  return {
    provider: raw.provider,
    apiKey: raw.apiKey,
    model: typeof raw.model === 'string' ? raw.model : '',
  }
}

function isBook(v: unknown): v is BookRecord {
  return (
    isRecord(v) &&
    isRecord(v.meta) &&
    typeof v.meta.slug === 'string' &&
    typeof v.content === 'string' &&
    isRecord(v.progress)
  )
}

function hydrateLibrary(): BookRecord[] {
  const raw = read(store.getLibrary)
  if (!Array.isArray(raw)) return []
  return raw.filter(isBook).map((b) => ({
    ...b,
    progress: {
      ...emptyProgress(),
      ...b.progress,
      readChapters: Array.isArray(b.progress.readChapters)
        ? b.progress.readChapters.filter((n): n is number => typeof n === 'number')
        : [],
    },
  }))
}

function isReview(v: unknown): v is Review {
  return (
    isRecord(v) &&
    typeof v.reviewId === 'string' &&
    typeof v.book === 'string' &&
    typeof v.dueDate === 'string'
  )
}

function hydrateReviews(): Review[] {
  const raw = read(store.getReviews)
  if (!Array.isArray(raw)) return []
  return raw.filter(isReview).map((r) => ({
    ...r,
    type: r.type === 'idea' ? 'idea' : 'quiz',
    interval: typeof r.interval === 'number' ? r.interval : 0,
    ease: typeof r.ease === 'number' ? r.ease : 2.5,
    reps: typeof r.reps === 'number' ? r.reps : 0,
    lapses: typeof r.lapses === 'number' ? r.lapses : 0,
    state: r.state === 'learning' || r.state === 'review' ? r.state : 'new',
  }))
}

function isApplyEntry(v: unknown): v is ApplyLogEntry {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.book === 'string' &&
    typeof v.date === 'string'
  )
}

function hydrateApplyLog(): ApplyLogEntry[] {
  const raw = read(store.getApplyLog)
  if (!Array.isArray(raw)) return []
  return raw
    .filter(isApplyEntry)
    .map((e) => ({ ...e, ideaId: typeof e.ideaId === 'string' ? e.ideaId : '' }))
}

function hydrateOnboarding(): OnboardingState {
  const raw = read(store.getOnboarding)
  if (!isRecord(raw) || typeof raw.step !== 'number' || typeof raw.done !== 'boolean') {
    return { ...DEFAULT_ONBOARDING }
  }
  return { step: raw.step, done: raw.done }
}

/** Birinchi ishga tushirish: demo kitob + uning takrorlash jadvali (5 tasi bugun) */
function demoReviews(): Review[] {
  const addDays = (d: number) => localDay(addLocalDays(d))
  return (DEMO_BOOK.analysis?.quizzes ?? []).map((q, i) => ({
    reviewId: q.id,
    book: DEMO_BOOK.meta.slug,
    type: 'quiz' as const,
    // dueReviews() mahalliy sana bilan solishtiradi — UTC sanasi ishlatilmasin
    dueDate: i < 5 ? localDay() : addDays(Math.floor(i / 5)),
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    state: 'new' as const,
  }))
}

function hydrateStore(): { library: BookRecord[]; reviews: Review[] } {
  const library = hydrateLibrary()
  const reviews = hydrateReviews()
  if (library.length) {
    lsSet(SEEDED_KEY, '1')
    return { library, reviews }
  }

  // Bo'sh kutubxona: foydalanuvchi o'zi o'chirgan yoki ma'lumot buzilgan bo'lishi mumkin.
  // Kitoblar o'chirilganda takrorlashlar saqlanib qoladi — ular bor bo'lsa, qayta seed qilmaymiz.
  if (lsGet(SEEDED_KEY) === '1' && reviews.length) return { library, reviews }

  const seededLibrary = [DEMO_BOOK]
  const seededReviews = reviews.length ? reviews : demoReviews()
  try {
    store.setLibrary(seededLibrary)
    if (!reviews.length) store.setReviews(seededReviews)
    lsSet(SEEDED_KEY, '1')
  } catch {
    /* xotira yozishga ruxsat bermasa ham demo ma'lumot ekranda turadi */
  }
  return { library: seededLibrary, reviews: seededReviews }
}

const INITIAL = hydrateStore()

interface Ctx {
  profile: Profile
  ai: AIConfig
  library: BookRecord[]
  reviews: Review[]
  applyLog: ApplyLogEntry[]
  onboarding: OnboardingState
  updateProfile: (patch: Partial<Profile>) => void
  updateAI: (cfg: AIConfig) => void
  addBook: (book: BookRecord) => void
  updateBook: (slug: string, fn: (b: BookRecord) => BookRecord) => void
  removeBook: (slug: string) => void
  setReviews: (r: Review[]) => void
  addApply: (entry: ApplyLogEntry) => void
  setOnboarding: (o: OnboardingState) => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => touchActiveDay(hydrateProfile()))
  const [ai, setAI] = useState<AIConfig>(hydrateAI)
  const [library, setLibrary] = useState<BookRecord[]>(INITIAL.library)
  const [reviews, setReviewsState] = useState<Review[]>(INITIAL.reviews)
  const [applyLog, setApplyLogState] = useState<ApplyLogEntry[]>(hydrateApplyLog)
  const [onboarding, setOnboardingState] = useState<OnboardingState>(hydrateOnboarding)

  // Mavzu (dark/light)
  useEffect(() => {
    document.documentElement.dataset.theme = profile.theme
  }, [profile.theme])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => {
      const next = { ...p, ...patch }
      store.setProfile(next)
      return next
    })
  }, [])

  // Yangi dizayn migratsiyasi: eski interfeysda 'tungi' standart edi —
  // birinchi ochilganda yangi yorug' mavzuga o'tamiz (keyin foydalanuvchi o'zi tanlaydi)
  useEffect(() => {
    if (lsGet('sn.ui.v2')) return
    lsSet('sn.ui.v2', '1')
    if (profile.theme === 'dark') updateProfile({ theme: 'light' })
  }, [profile.theme, updateProfile])

  const updateAI = useCallback((cfg: AIConfig) => {
    setAI(cfg)
    store.setAI(cfg)
  }, [])

  const addBook = useCallback((book: BookRecord) => {
    setLibrary((lib) => {
      const next = [book, ...lib.filter((b) => b.meta.slug !== book.meta.slug)]
      store.setLibrary(next)
      return next
    })
  }, [])

  const updateBook = useCallback((slug: string, fn: (b: BookRecord) => BookRecord) => {
    setLibrary((lib) => {
      const next = lib.map((b) => (b.meta.slug === slug ? fn(b) : b))
      store.setLibrary(next)
      return next
    })
  }, [])

  const removeBook = useCallback((slug: string) => {
    setLibrary((lib) => {
      const next = lib.filter((b) => b.meta.slug !== slug)
      store.setLibrary(next)
      return next
    })
  }, [])

  const setReviews = useCallback((r: Review[]) => {
    setReviewsState(r)
    store.setReviews(r)
  }, [])

  const addApply = useCallback((entry: ApplyLogEntry) => {
    setApplyLogState((l) => {
      const next = [entry, ...l]
      store.setApplyLog(next)
      return next
    })
  }, [])

  const setOnboarding = useCallback((o: OnboardingState) => {
    setOnboardingState(o)
    store.setOnboarding(o)
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      profile,
      ai,
      library,
      reviews,
      applyLog,
      onboarding,
      updateProfile,
      updateAI,
      addBook,
      updateBook,
      removeBook,
      setReviews,
      addApply,
      setOnboarding,
    }),
    [
      profile,
      ai,
      library,
      reviews,
      applyLog,
      onboarding,
      updateProfile,
      updateAI,
      addBook,
      updateBook,
      removeBook,
      setReviews,
      addApply,
      setOnboarding,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp faqat AppProvider ichida ishlaydi')
  return ctx
}
