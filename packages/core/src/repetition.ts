/**
 * Spaced repetition — boslang'ich jadval (docs/06 §5).
 * 1→1 kun, 2→3 kun, 3→7 kun, 4→14 kun, 5→30 kun; keyin javob sifatiga qarab.
 * Keyinroq FSRS algoritmiga o'tish rejalashtirilgan.
 */
import type { Review } from './types'
import { localDay } from './date'

export const DEFAULT_INTERVALS = [1, 3, 7, 14, 30]

/**
 * Mahalliy kalendar bo'yicha N kun qo'shish.
 * 24 soatlik millysekund qo'shish DST o'tishida kun siljishiga olib keladi;
 * yil/oy/kun maydonlari bilan ishlash UTC va DST driftsiz natija beradi.
 */
function addLocalDays(base: Date, days: number): string {
  const n = Number.isFinite(days) ? Math.trunc(days) : 0
  return localDay(new Date(base.getFullYear(), base.getMonth(), base.getDate() + n))
}

/** Buzilgan (NaN / undefined / noto'g'ri tip) sonni xavfsiz qiymatga keltirish. */
function finiteOr(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** 'YYYY-MM-DD' kalendar kaliti; noodatiy qiymatlar rad etiladi. */
function dateKey(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const key = value.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null
}

/** Yangi takrorlash yozuvi */
export function newReview(reviewId: string, book: string, type: Review['type']): Review {
  return {
    reviewId,
    book,
    type,
    dueDate: localDay(),
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    state: 'new',
  }
}

/**
 * Javobdan keyin jadvalni yangilash.
 * quality: 0-2 noto'g'ri/qiyin, 3-5 to'g'ri/oson
 */
export function scheduleReview(r: Review, quality: number): Review {
  const today = new Date()
  const due = (days: number) => addLocalDays(today, days)

  // Har qanday buzilgan qiymat ham bashorat qilinadigan natija berishi kerak.
  const q = Number.isFinite(quality) ? Math.min(5, Math.max(0, Math.trunc(quality))) : 0
  const ease = finiteOr(r.ease, 2.5)
  const interval = Math.min(365, Math.max(0, finiteOr(r.interval, 0)))
  const reps = Math.max(0, Math.floor(finiteOr(r.reps, 0)))
  const lapses = Math.max(0, Math.floor(finiteOr(r.lapses, 0)))

  if (q < 3) {
    // Unutdi — boshidan
    return {
      ...r,
      dueDate: due(1),
      interval: 0,
      ease,
      reps: 0,
      lapses: lapses + 1,
      state: 'learning',
    }
  }

  const nextInterval =
    interval === 0
      ? DEFAULT_INTERVALS[0]
      : interval < 1
        ? 1
        : Math.min(
            Math.round(interval * (q >= 4 ? ease : Math.max(1.3, ease - 0.2))),
            365,
          )

  const nextEase = Math.min(3.0, Math.max(1.3, ease + (q >= 4 ? 0.05 : -0.15)))

  return {
    ...r,
    dueDate: due(nextInterval),
    interval: nextInterval,
    ease: nextEase,
    reps: reps + 1,
    lapses,
    state: 'review',
  }
}

/** Bugunga to'g'ri kelgan takrorlashlar (barqaror tartib: eski sana, keyin id). */
export function dueReviews(reviews: Review[]): Review[] {
  const today = localDay()
  const list: Review[] = Array.isArray(reviews) ? reviews : []
  return list
    .filter((r) => {
      const key = dateKey(r?.dueDate)
      return key !== null && key <= today
    })
    .sort((a, b) => {
      const byDate = (dateKey(a.dueDate) ?? '').localeCompare(dateKey(b.dueDate) ?? '')
      return byDate !== 0 ? byDate : String(a.reviewId).localeCompare(String(b.reviewId))
    })
}
