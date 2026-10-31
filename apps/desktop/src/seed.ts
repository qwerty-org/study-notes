/**
 * Demo kitob — content/books/10-daqiqa-odatlar (repo ildizidan import).
 * Birinchi ishga tushirishda kutubxonaga avtomatik qo'shiladi.
 */
import type { BookAnalysis, BookRecord } from '@study-notes/core'
import content from '../../../content/books/10-daqiqa-odatlar/content.md?raw'
import metaJson from '../../../content/books/10-daqiqa-odatlar/meta.json'
import ideasJson from '../../../content/books/10-daqiqa-odatlar/analysis/ideas.json'
import quizzesJson from '../../../content/books/10-daqiqa-odatlar/analysis/quizzes.json'
import applyJson from '../../../content/books/10-daqiqa-odatlar/analysis/apply.json'

const analysis: BookAnalysis = {
  book: metaJson.slug,
  rulesVersion: ideasJson.rulesVersion,
  analyzedAt: ideasJson.analyzedAt,
  chapters: ideasJson.chapters,
  quizzes: quizzesJson.items,
  scenarios: applyJson.scenarios,
} as unknown as BookAnalysis

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
