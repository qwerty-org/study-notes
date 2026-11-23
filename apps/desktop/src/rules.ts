/**
 * agent-rules/ (repo ildizi) — yagona manbadan raw-import.
 * Vite server.fs.allow (vite.config.ts) shu yo'lga ruxsat beradi.
 * .md fayllar system prompt, JSON sxemalar esa AI javobi formati uchun.
 */
import analystRule from '../../../agent-rules/analyst.md?raw'
import quizMasterRule from '../../../agent-rules/quiz-master.md?raw'
import lifeMentorRule from '../../../agent-rules/life-mentor.md?raw'
import tutorRule from '../../../agent-rules/tutor.md?raw'
import analystSchemaJson from '../../../agent-rules/schemas/analyst.json'
import quizSchemaJson from '../../../agent-rules/schemas/quiz.json'
import lifeSchemaJson from '../../../agent-rules/schemas/life-mentor.json'
import type { AgentRules } from '@study-notes/ai'

export const RULES: AgentRules = {
  analyst: analystRule,
  quizMaster: quizMasterRule,
  lifeMentor: lifeMentorRule,
}

/** 3 bosqichli tahlilga kirmaydi — AI ustoz rejimi uchun alohida saqlanadi. */
export const TUTOR_RULE = tutorRule

/** Qoidalar versiyasi — demo kitob `meta.json` dagi `rulesVersion` bilan bir xil formatda. */
export const RULES_VERSION = '2026-10-31'

/** Kalitlar analyzeChapter() ning schemas parametri bilan bir xil: analyst / quiz / life. */
export const SCHEMAS = {
  analyst: JSON.stringify(analystSchemaJson, null, 2),
  quiz: JSON.stringify(quizSchemaJson, null, 2),
  life: JSON.stringify(lifeSchemaJson, null, 2),
}
