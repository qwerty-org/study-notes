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

/** Birinchi ishga tushirish: demo kitob + uning takrorlash jadvali (5 tasi bugun) */
function ensureSeed(): void {
  if (localStorage.getItem(SEEDED_KEY) === '1') return
  localStorage.setItem(SEEDED_KEY, '1')
  if (store.getLibrary().length) return

  store.setLibrary([DEMO_BOOK])
  const today = () => new Date().toISOString().slice(0, 10)
  const addDays = (d: number) =>
    new Date(Date.now() + d * 86400000).toISOString().slice(0, 10)

  const demoReviews = (DEMO_BOOK.analysis?.quizzes ?? []).map((q, i) => ({
    reviewId: q.id,
    book: DEMO_BOOK.meta.slug,
    type: 'quiz' as const,
    dueDate: i < 5 ? today() : addDays(Math.floor(i / 5)),
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    state: 'new' as const,
  }))
  store.setReviews(demoReviews)
}

ensureSeed()

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
  const [profile, setProfile] = useState<Profile>(() => touchActiveDay(store.getProfile()))
  const [ai, setAI] = useState<AIConfig>(() => store.getAI())
  const [library, setLibrary] = useState<BookRecord[]>(() => store.getLibrary())
  const [reviews, setReviewsState] = useState<Review[]>(() => store.getReviews())
  const [applyLog, setApplyLogState] = useState<ApplyLogEntry[]>(() => store.getApplyLog())
  const [onboarding, setOnboardingState] = useState<OnboardingState>(() =>
    store.getOnboarding(),
  )

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
