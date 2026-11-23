/**
 * Study Notes — asosiy data kontraktlari.
 *
 * Manbalar: `docs/06-data-formats.md` (saqlash formatlari) va
 * `agent-rules/schemas/*.json` (AI javoblari uchun JSON sxemalari).
 *
 * Eslatma: bu fayldagi barcha o'zgarishlar qo'shimcha (additive) xarakterga ega —
 * mavjud eksport nomlari, maydon nomlari va maydonlarning qiymat to'plami
 * o'zgartirilmadi. Sxemalarda toraytirilgan qiymatlar uchun alohida
 * `Strict*` tiplari taklif etiladi (eskil/cache'langan ma'lumotlarni buzmaslik uchun).
 */

/* ==================== Qiymat to'plamlari (literal unions) ==================== */

/** Kitob manbasining asl formati (docs/06 §1, `meta.json.sourceFormat`). */
export type SourceFormat = 'md' | 'txt' | 'pdf' | 'epub'

/** Savol qiyinligi (`schemas/quiz.json` → `difficulty`). */
export type QuizDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Quiz variantlarining belgisi (`schemas/quiz.json` → `options[].key` va `answer`).
 * Sxemada faqat A–D ruxsat etilgan.
 */
export type QuizOptionKey = 'A' | 'B' | 'C' | 'D'

/**
 * "Hayotda qo'llash" senariysining konteksti (`schemas/life-mentor.json` → `context`).
 * Eslatma: foydalanuvchi jurnalidagi `ApplyLogEntry.context` erkin satr bo'lib qoladi
 * (docs/06 §6 da `"uy"` kabi qiymatlar uchraydi).
 */
export type ApplyContext = 'ish' | 'oila' | "do'stlik" | "o'qish" | 'shaxsiy'

/** Qo'llash jurnali yozuvi qaysi obyektga tegishli ekanligi. */
export type ApplyKind = 'idea' | 'scenario'

/** Ilova tili. Hozircha faqat o'zbekcha. */
export type AppLanguage = 'uz'

/** Ilova vizual mavzusi. */
export type AppTheme = 'dark' | 'light'

/** O'quchi qog'oz rangi (ko'z uchun qulay variant). */
export type PaperTheme = 'paper' | 'sepia'

/* ==================== Kitob va boblar ==================== */

/** Kitob tahlilining holati: import qilingan → tahlil qilinayotgan → tugagan / qisman. */
export type BookStatus = 'imported' | 'analyzing' | 'analyzed' | 'partial'

/** `meta.json` — kitob haqidagi asosiy ma'lumot (docs/06 §1). */
export interface BookMeta {
  /** Kitob identifikatori (slug), masalan `10-daqiqa-odatlar`. Doimiy — fayl nomi bilan bog'liq. */
  slug: string
  /** Kitob sarlavhasi. */
  title: string
  /** Muallif (ma'lum bo'lsa). */
  author?: string
  /** Asl matn tili (masalan `en`), AI javoblari esa foydalanuvchi tilida bo'ladi. */
  language?: string
  /** Manba fayl formati. */
  sourceFormat: SourceFormat
  /** Jami boblar soni (indeks emas — 1 dan boshlab hisoblanadi). */
  chapters: number
  /** Joriy tahlil holati. */
  status: BookStatus
  /** Tahlil algoritmi/pipeline versiyasi; o'zgarsa qayta tahlil talab qilinadi. */
  analysisVersion?: number
  /** Qo'llanilgan agent-qoidalar versiyasi (masalan `2026-10-31`). */
  rulesVersion?: string
  /** Kutubxonaga qo'shilgan vaqt (ISO 8601). */
  addedAt: string
  /** Demo izohi yoki kutubxona ichidagi qo'shimcha eslatma (ixtiyoriy). */
  note?: string
}

/** Matndan ajratilgan bob (`splitChapters` natijasi). `index` — 0 asosli. */
export interface Chapter {
  /** Bob tartib raqami (0 dan boshlanadi). */
  index: number
  /** Bob sarlavhasi. */
  title: string
  /** Bob matni (to'liq, xom ko'rinishda). */
  content: string
}

/* ==================== Tahlilchi (analyst) natijasi ==================== */

/** `agent-rules/analyst.md` javobidan olingan asosiy g'oya (`schemas/analyst.json`). */
export interface KeyIdea {
  /** Barqaror identifikator, masalan `ch4-i1` (4-bob, 1-g'oya). */
  id: string
  /** G'oya o'zi — 1-2 gap. */
  idea: string
  /** Nima uchun muhimligi. */
  why: string
  /** Foydalanuvchi ertaga bajara oladigan aniq birinchi qadam. */
  howToApply: string
  /** Qo'llash sohalari: ish | oila | do'stlik | o'qish | shaxsiy (eski ma'lumotlarda erkin satr). */
  applyTags?: string[]
}

/** Tahlilchi topgan qisqa atama va uning sodda izohi. */
export interface Term {
  /** Atama nomi. */
  term: string
  /** Oddiy tilda 1-2 gap izoh. */
  definitionSimple: string
  /** Tushunarli taqqoslash (ixtiyoriy). */
  metaphor?: string
}

/** Bir bob uchun tahlilchi natijasi. */
export interface ChapterAnalysis {
  /** Bob indeksi (0 asosli, `Chapter.index` bilan mos). */
  index: number
  /** Bob sarlavhasi. */
  title: string
  /** Bobdagi asosiy g'oyalar. */
  keyIdeas: KeyIdea[]
  /** Bobdagi muhim atamalar. */
  terms: Term[]
}

/* ==================== Quiz master natijasi ==================== */

/** Savol turi: amaliy vaziyat yoki nazariy bilim. */
export type QuizType = 'scenario' | 'theory'

/** Bitta javob varianti. `key` A–D bo'lishi kerak (sxema bo'yicha). */
export interface QuizOption {
  /** Variant belgisi: A | B | C | D. */
  key: string
  /** Variant matni. */
  text: string
}

/** To'g'ri va (ixtiyoriy) noto'g'ri javoblar uchun tushuntirishlar. */
export interface QuizExplain {
  /** To'g'ri javob nima uchun to'g'ri ekanligi. */
  correct: string
  /** Noto'g'ri variant kaliti → nega u noto'g'ri (kalitlar `QuizOption.key` bilan mos). */
  wrong?: Record<string, string>
}

/** Bitta quiz savoli (`schemas/quiz.json`). */
export interface QuizItem {
  /** Barqaror identifikator, masalan `ch4-q1`; takrorlash jadvalida ishlatiladi. */
  id: string
  /** Qaysi bobga tegishli (0 asosli indeks). */
  chapter: number
  /** Savol turi. */
  type: QuizType
  /** Savol matni. */
  question: string
  /** Javob variantlari (sxema bo'yicha aynan 4 ta). */
  options: QuizOption[]
  /** To'g'ri variant kaliti (`options[].key` lardan biri). */
  answer: string
  /** Javob ochilganda ko'rsatiladigan izoh. */
  explain: QuizExplain
  /** Qiyinlik darajasi (ixtiyoriy). */
  difficulty?: QuizDifficulty
  /** Bog'langan g'oya id lari — zaif javob = shu g'oyani qayta o'qish. */
  concepts?: string[]
}

/**
 * Sxemaga qat'iy mos keladigan quiz varianti: `key` faqat A–D.
 * Eski saqlangan ma'lumotlar `QuizOption` bilan ishlayveradi.
 */
export type StrictQuizOption = Omit<QuizOption, 'key'> & { key: QuizOptionKey }

/** Sxemaga qat'iy mos keladigan quiz savoli (variant kalitlari va javob A–D). */
export type StrictQuizItem = Omit<QuizItem, 'answer' | 'options'> & {
  answer: QuizOptionKey
  options: StrictQuizOption[]
}

/* ==================== Life mentor natijasi ==================== */

/** `agent-rules/life-mentor.md` javobi — real hayotdagi qo'llash vaziyati. */
export interface ApplyScenario {
  /** Barqaror identifikator, masalan `ch4-a1`. */
  id: string
  /** Bog'langan g'oya id si (player kodida "ideaId" bilan moslik uchun). */
  ideaId: string
  /** Real vaziyat tavsifi — 2-3 gap. */
  situation: string
  /** Aniq to'g'ri gap yoki qadam. */
  rightAction: string
  /** Ko'pchilik qiladigan xato. */
  wrongAction: string
  /** Xatoning oqibati (ixtiyoriy). */
  whyWrong?: string
  /** Kontekst: ish | oila | do'stlik | o'qish | shaxsiy (sxema enum'i). */
  context?: string
}

/** Sxema enum'iga mos keladigan toraytirilgan senariy (ixtiyoriy kontekst). */
export type StrictApplyScenario = Omit<ApplyScenario, 'context'> & { context?: ApplyContext }

/* ==================== Saqlash (BookRecord) ==================== */

/** Bir kitob bo'yicha yig'ilgan to'liq tahlil (docs/06 §2-4). */
export interface BookAnalysis {
  /** Kitob slug'i. */
  book: string
  /** Tahlilda ishlatilgan qoidalar versiyasi. */
  rulesVersion: string
  /** Tahlil tugagan vaqt (ISO 8601). */
  analyzedAt: string
  /** Boblar bo'yicha tahlil natijalari. */
  chapters: ChapterAnalysis[]
  /** Kitob bo'yicha barcha quiz savollari. */
  quizzes: QuizItem[]
  /** Hayotda qo'llash vaziyatlari. */
  scenarios: ApplyScenario[]
}

/** Kutubxonada saqlanadigan kitob yozuvi (meta + matn + tahlil + progress). */
export interface BookRecord {
  /** Kitob metadatasi. */
  meta: BookMeta
  /** To'liq matn (import qilingan kitob). */
  content: string
  /** AI tahlili — hali tugamagan bo'lsa yo'q. */
  analysis?: BookAnalysis
  /** Foydalanuvchi o'qish progressi. */
  progress: BookProgress
}

/** O'quchi ajratib qo'ygan matn bo'lagi. */
export interface SavedHighlight {
  /** Ajratma identifikatori. */
  id: string
  /** Ajratilgan matn. */
  text: string
  /** Bob indeksi (0 asosli). */
  chapter: number
  /** Sahifa raqami (1 asosli). */
  page: number
}

/** O'quchi o'qish afzalliklari (kitob bilan birga eksport/import qilinadi). */
export interface ReaderPrefs {
  /** Shrift hajmi (px). */
  fontSize: number
  /** Qog'oz rangi. */
  paper: PaperTheme
}

/** Kitob bo'yicha o'qish va quiz statistikasi. */
export interface BookProgress {
  /** O'qilgan boblar foizi (0–100). */
  percent: number
  /** Hozirgi bob indeksi (0 asosli). */
  currentChapter: number
  /** Hozirgi sahifa (ixtiyoriy). */
  currentPage?: number
  /** O'qilgan boblar indekslari. */
  readChapters: number[]
  /** To'g'ri javoblar soni. */
  quizCorrect: number
  /** Jami javoblar soni. */
  quizTotal: number
  /** O'qish sozlamalari kitob bilan birga saqlanadi (eksport/importga kiradi). */
  reader?: ReaderPrefs
  /** Ajratmalar ro'yxati. */
  highlights?: SavedHighlight[]
}

/* ==================== Spaced repetition (docs/06 §5) ==================== */

/** Takrorlash holati: yangi → o'rganilayotgan → takrorlash bosqichida. */
export type ReviewState = 'new' | 'learning' | 'review'

/** Bitta g'oya/quiz uchun takrorlash jadvali yozuvi. */
export interface Review {
  /** Takrorlanadigan obyekt id si (quiz yoki g'oya id si). */
  reviewId: string
  /** Qaysi kitobga tegishli (slug). */
  book: string
  /** Nima takrorlanadi: quiz savoli yoki g'oya. */
  type: 'quiz' | 'idea'
  /** Keyingi takrorlash kuni (ISO 8601: `YYYY-MM-DD`). */
  dueDate: string
  /** Joriy oraliq (kunlarda; 0 — hali takrorlanmagan). */
  interval: number
  /** FSRS/SM-2 ease omili (taxminan 1.3–3.0). */
  ease: number
  /** Muvaffaqiyatli takrorlashlar soni. */
  reps: number
  /** Unutilishlar soni. */
  lapses: number
  /** Joriy holat. */
  state: ReviewState
}

/* ==================== "Men qo'lladim" jurnali ==================== */

/** Foydalanuvchi g'oyani amalda qo'llaganligi haqidagi yozuv (docs/06 §6). */
export interface ApplyLogEntry {
  /** Yozuv identifikatori, masalan `log-2026-10-31-1`. */
  id: string
  /** Kitob slug'i. */
  book: string
  /** G'oya yoki vaziyat bog'langan g'oya id si (escha kod bilan moslik uchun). */
  ideaId: string
  /** Qo'llangan sana (`YYYY-MM-DD`). */
  date: string
  /** Foydalanuvchi qo'shimcha izohi. */
  note?: string
  /** Qaysi sohada qo'llanganligi (erkin satr: `ish`, `uy`, `shaxsiy` va h.k.). */
  context?: string
  /** Qaysi turdagi yozuv ekanligi — g'oya va vaziyat belgilari aralashib ketmasligi uchun. */
  kind?: ApplyKind
  /** Asl obyekt id si (g'oya id yoki vaziyat id). */
  refId?: string
}

/* ==================== Profil va AI sozlamalari ==================== */

/** Foydalanuvchi profili va ko'rinish sozlamalari. */
export interface Profile {
  /** Foydalanuvchi ismi. */
  name: string
  /** Avatar (emoji yoki qisqa belgi). */
  avatar: string
  /** Ketma-ket faol kunlar soni (streak). */
  streak: number
  /** Oxirgi faol kun (`YYYY-MM-DD`). */
  lastActive?: string
  /** Ilova tili. */
  language: AppLanguage
  /** Vizual mavzu. */
  theme: AppTheme
  /** Boshlang'ich sozlash tugallanganmi. */
  onboarded: boolean
}

/** Qo'llab-quvvatlanadigan AI provayderlari. */
export type AIProvider = 'gemini' | 'openai' | 'ollama'

/** AI ulanish sozlamalari (API kalit eksport paytida o'chiriladi). */
export interface AIConfig {
  /** Tanlangan provayder. */
  provider: AIProvider
  /** API kalit (faqat lokal saqlanadi). */
  apiKey: string
  /** Model nomi, masalan `gemini-2.0-flash`. */
  model?: string
}

/** Boshlang'ich sozlash (onboarding) holati. */
export interface OnboardingState {
  /** Joriy bosqich (0 dan boshlanadi). */
  step: number
  /** Jarayon tugallanganmi. */
  done: boolean
}
