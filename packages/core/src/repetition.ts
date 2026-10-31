/**
 * Spaced repetition — boslang'ich jadval (docs/06 §5).
 * 1→1 kun, 2→3 kun, 3→7 kun, 4→14 kun, 5→30 kun; keyin javob sifatiga qarab.
 * Keyinroq FSRS algoritmiga o'tish rejalashtirilgan.
 */
import type { Review } from './types'

export const DEFAULT_INTERVALS = [1, 3, 7, 14, 30]

/** Yangi takrorlash yozuvi */
export function newReview(reviewId: string, book: string, type: Review['type']): Review {
  const today = new Date()
  return {
    reviewId,
    book,
    type,
    dueDate: today.toISOString().slice(0, 10),
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
  const due = (days: number) =>
    new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10)

  if (quality < 3) {
    // Unutdi — boshidan
    return {
      ...r,
      dueDate: due(1),
      interval: 0,
      reps: 0,
      lapses: r.lapses + 1,
      state: 'learning',
    }
  }

  const nextInterval =
    r.interval === 0
      ? DEFAULT_INTERVALS[0]
      : r.interval < 1
        ? 1
        : Math.min(
            Math.round(r.interval * (quality >= 4 ? r.ease : Math.max(1.3, r.ease - 0.2))),
            365,
          )

  const ease = Math.min(3.0, Math.max(1.3, r.ease + (quality >= 4 ? 0.05 : -0.15)))

  return {
    ...r,
    dueDate: due(nextInterval),
    interval: nextInterval,
    ease,
    reps: r.reps + 1,
    state: 'review',
  }
}

/** Bugunga to'g'ri kelgan takrorlashlar */
export function dueReviews(reviews: Review[]): Review[] {
  const today = new Date().toISOString().slice(0, 10)
  return reviews.filter((r) => r.dueDate <= today)
}
