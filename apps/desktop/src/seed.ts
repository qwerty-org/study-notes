/**
 * Demo kitob — content/books/10-daqiqa-odatlar (repo ildizidan import).
 * Birinchi ishga tushirishda kutubxonaga avtomatik qo'shiladi.
 */
import type {
  ApplyScenario,
  BookAnalysis,
  BookRecord,
  ChapterAnalysis,
  QuizItem,
} from '@study-notes/core'
import content from '../../../content/books/10-daqiqa-odatlar/content.md?raw'
import metaJson from '../../../content/books/10-daqiqa-odatlar/meta.json'
import ideasJson from '../../../content/books/10-daqiqa-odatlar/analysis/ideas.json'
import quizzesJson from '../../../content/books/10-daqiqa-odatlar/analysis/quizzes.json'
import applyJson from '../../../content/books/10-daqiqa-odatlar/analysis/apply.json'

/**
 * Har bir maydon alohida tiplanadi: butun obyektni `as unknown as` bilan
 * yashirish g'oya / savol / senariy massivlarining aralashib ketishiga yo'l qo'yardi.
 */
const chapters = ideasJson.chapters as ChapterAnalysis[]
const quizzes = quizzesJson.items as QuizItem[]
const scenarios = applyJson.scenarios as ApplyScenario[]

const analysis: BookAnalysis = {
  book: metaJson.slug,
  rulesVersion: ideasJson.rulesVersion,
  analyzedAt: ideasJson.analyzedAt,
  chapters,
  quizzes,
  scenarios,
}

/**
 * Demo ma'lumotlarining ichki bog'liqligini tekshiradi (faqat dev rejimida
 * ogohlantiradi). "Men qo'lladim" jurnalida `kind`/`refId` to'g'ri bog'lanishi
 * uchun g'oya, savol va senariy id lari noyob, havolalar esa mavjud bo'lishi shart.
 */
function checkDemoIntegrity(): void {
  const problems: string[] = []
  const ideaIds = new Set(chapters.flatMap((c) => c.keyIdeas.map((i) => i.id)))
  const seen = new Set<string>()

  const claim = (id: string, source: string) => {
    if (seen.has(id)) problems.push(`${source}: takroriy id — ${id}`)
    seen.add(id)
  }

  chapters.forEach((c) => c.keyIdeas.forEach((i) => claim(i.id, 'g\'oya')))
  quizzes.forEach((q) => {
    claim(q.id, 'savol')
    if (q.chapter < 0 || q.chapter >= chapters.length)
      problems.push(`${q.id}: noto'g'ri bob — ${q.chapter}`)
    q.concepts?.forEach((id) => {
      if (!ideaIds.has(id)) problems.push(`${q.id}: yo'q g'oyaga havola — ${id}`)
    })
  })
  scenarios.forEach((s) => {
    claim(s.id, 'senariy')
    if (!ideaIds.has(s.ideaId)) problems.push(`${s.id}: yo'q g'oyaga havola — ${s.ideaId}`)
    if (s.id === s.ideaId) problems.push(`${s.id}: senariy va g'oya id lari bir xil`)
  })

  if (chapters.length !== metaJson.chapters)
    problems.push(`boblar soni mos emas: ${chapters.length} ≠ ${metaJson.chapters}`)
  if ([ideasJson.book, quizzesJson.book, applyJson.book].some((b) => b !== metaJson.slug))
    problems.push('manbalardagi kitob slug lari mos emas')
  if (ideasJson.rulesVersion !== metaJson.rulesVersion)
    problems.push('rulesVersion mos emas')

  if (problems.length) console.warn('[demo seed] ma\'lumotlar nomuvofiqligi:', problems)
}

if (import.meta.env.DEV) checkDemoIntegrity()

export const DEMO_BOOK: BookRecord = {
  meta: {
    slug: metaJson.slug,
    title: metaJson.title,
    author: metaJson.author,
    language: metaJson.language,
    sourceFormat: metaJson.sourceFormat as 'md' | 'txt' | 'pdf' | 'epub',
    chapters: metaJson.chapters,
    status: metaJson.status as BookRecord['meta']['status'],
    analysisVersion: metaJson.analysisVersion,
    rulesVersion: metaJson.rulesVersion,
    addedAt: metaJson.addedAt,
  },
  content,
  analysis,
  progress: {
    percent: 0,
    currentChapter: 0,
    readChapters: [],
    quizCorrect: 0,
    quizTotal: 0,
  },
}
