/**
 * Bob tahlili pipeline (docs/03 §Tahlil, docs/05).
 * Har bob uchun 3 ta agent chaqiruvi: analyst → quiz-master → life-mentor.
 * Har biri agent-rules/*.md (system prompt) + schemas/*.json (format) bilan.
 */
import type {
  AIConfig,
  ApplyScenario,
  Chapter,
  ChapterAnalysis,
  KeyIdea,
  QuizItem,
  Term,
} from '@study-notes/core'
import { complete } from './providers'
import { extractJSON, withJSONRetry } from './json'

export interface AgentRules {
  analyst: string
  quizMaster: string
  lifeMentor: string
}

export interface AnalyzeProgress {
  chapter: number
  total: number
  phase: 'analyst' | 'quiz' | 'life'
  title: string
}

interface AnalystOut {
  keyIdeas?: KeyIdea[]
  terms?: Term[]
}
interface QuizOut {
  items?: QuizItem[]
}
interface LifeOut {
  scenarios?: ApplyScenario[]
}

/** JSON talab qiladigan agent chaqiruvi (1 marta retry bilan) */
async function agent<T>(
  cfg: AIConfig,
  system: string,
  user: string,
  parse: (raw: string) => T,
): Promise<T> {
  return withJSONRetry(
    async (feedback) =>
      complete(
        cfg,
        feedback ? `${system}\n\nMUHIM OGohlantirish: ${feedback}` : system,
        user,
      ),
    parse,
  )
}

export async function analyzeChapter(
  cfg: AIConfig,
  rules: AgentRules,
  schemas: { analyst: string; quiz: string; life: string },
  chapter: Chapter,
  onPhase?: (phase: AnalyzeProgress['phase']) => void,
): Promise<{
  analysis: ChapterAnalysis
  quizzes: QuizItem[]
  scenarios: ApplyScenario[]
}> {
  const user = `BOB ${chapter.index + 1}: ${chapter.title}\n\n---\n\n${chapter.content}`

  // 1. Tahlilchi
  onPhase?.('analyst')
  const analyst = await agent<AnalystOut>(
    cfg,
    `${rules.analyst}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.analyst}`,
    user,
    extractJSON<AnalystOut>,
  )
  const keyIdeas = (analyst.keyIdeas ?? []).map((i, idx) => ({
    ...i,
    id: i.id || `ch${chapter.index + 1}-i${idx + 1}`,
  }))
  const terms: Term[] = analyst.terms ?? []

  // 2. Quiz mutaxassisi
  onPhase?.('quiz')
  const quizOut = await agent<QuizOut>(
    cfg,
    `${rules.quizMaster}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.quiz}\n\nG'oyalar (shular asosida savol tuz):\n${JSON.stringify(
      keyIdeas.map((k) => ({ id: k.id, idea: k.idea })),
    )}`,
    user,
    extractJSON<QuizOut>,
  )
  const quizzes = (quizOut.items ?? []).map((q, idx) => ({
    ...q,
    id: q.id || `ch${chapter.index + 1}-q${idx + 1}`,
    chapter: chapter.index,
  }))

  // 3. Hayotga tatbiq
  onPhase?.('life')
  const lifeOut = await agent<LifeOut>(
    cfg,
    `${rules.lifeMentor}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.life}\n\nG'oyalar (shular uchun senariy yoz):\n${JSON.stringify(
      keyIdeas.map((k) => ({ id: k.id, idea: k.idea, howToApply: k.howToApply })),
    )}`,
    user,
    extractJSON<LifeOut>,
  )
  const scenarios = (lifeOut.scenarios ?? []).map((s, idx) => ({
    ...s,
    id: s.id || `ch${chapter.index + 1}-a${idx + 1}`,
  }))

  return {
    analysis: { index: chapter.index, title: chapter.title, keyIdeas, terms },
    quizzes,
    scenarios,
  }
}
