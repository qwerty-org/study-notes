/**
 * `@study-notes/core` — yagona ommaviy kirish nuqtasi (public entry point).
 *
 * Barcha asosiy modullar qayta eksport qilinadi. Yangi modul yoki eksport
 * qo'shishda faqat qo'shimcha (additive) o'zgartirish kiritish kerak: mavjud
 * eksport nomlarini o'zgartirish yoki o'chirish ularga bog'liq
 * iste'molchilarni (apps/desktop, packages/ai) buzadi.
 */
export * from './types'
export * from './storage'
export * from './repetition'
export * from './parsing'
export * from './date'
