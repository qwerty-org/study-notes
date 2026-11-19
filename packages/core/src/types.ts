/** Study Notes — asosiy data modellari (docs/06-data-formats.md ga mos) */

export type BookStatus = 'imported' | 'analyzing' | 'analyzed' | 'partial'

export interface BookMeta {
  slug: string
  title: string
  author?: string
  language?: string
  sourceFormat: 'md' | 'txt' | 'pdf' | 'epub'
  chapters: number
  status: BookStatus
  analysisVersion?: number
  rulesVersion?: string
  addedAt: string
}

export interface Chapter {
  index: number
  title: string
  content: string
}

/** agent-rules/analyst.md javobi */
export interface KeyIdea {
  id: string
  idea: string
  why: string
  howToApply: string
  applyTags?: string[]
}

export interface Term {
  term: string
  definitionSimple: string
  metaphor?: string
}

export interface ChapterAnalysis {
  index: number
  title: string
  keyIdeas: KeyIdea[]
  terms: Term[]
}

/** agent-rules/quiz-master.md javobi */
export type QuizType = 'scenario' | 'theory'

export interface QuizOption {
  key: string
  text: string
}

export interface QuizExplain {
  correct: string
  wrong?: Record<string, string>
}

export interface QuizItem {
  id: string
  chapter: number
  type: QuizType
  question: string
  options: QuizOption[]
  answer: string
  explain: QuizExplain
  difficulty?: 'easy' | 'medium' | 'hard'
  concepts?: string[]
}

/** agent-rules/life-mentor.md javobi */
export interface ApplyScenario {
  id: string
  ideaId: string
  situation: string
  rightAction: string
  wrongAction: string
  whyWrong?: string
  context?: string
}

export interface BookAnalysis {
  book: string
  rulesVersion: string
  analyzedAt: string
  chapters: ChapterAnalysis[]
  quizzes: QuizItem[]
  scenarios: ApplyScenario[]
}

/** Saqlangan kitob yozuvi */
export interface BookRecord {
  meta: BookMeta
  content: string
  analysis?: BookAnalysis
  progress: BookProgress
}

export interface BookProgress {
  percent: number
  currentChapter: number
  readChapters: number[]
  quizCorrect: number
  quizTotal: number
}

/* ---------- Spaced repetition (docs/06 §5) ---------- */

export type ReviewState = 'new' | 'learning' | 'review'

export interface Review {
  reviewId: string
  book: string
  type: 'quiz' | 'idea'
  dueDate: string
  interval: number
  ease: number
  reps: number
  lapses: number
  state: ReviewState
}

/* ---------- "Men qo'lladim" jurnali ---------- */

export interface ApplyLogEntry {
  id: string
  book: string
  /** G'oya yoki vaziyat bog'langan g'oya id si (escha kod bilan moslik uchun) */
  ideaId: string
  date: string
  note?: string
  context?: string
  /** Qaysi turdagi yozuv ekanligi — g'oya va vaziyat belgilari aralashib ketmasligi uchun */
  kind?: 'idea' | 'scenario'
  /** Asl obyekt id si (g'oya id yoki vaziyat id) */
  refId?: string
}

/* ---------- Profil va AI sozlamalari ---------- */

export interface Profile {
  name: string
  avatar: string
  streak: number
  lastActive?: string
  language: 'uz'
  theme: 'dark' | 'light'
  onboarded: boolean
}

export type AIProvider = 'gemini' | 'openai' | 'ollama'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model?: string
}

export interface OnboardingState {
  step: number
  done: boolean
}
