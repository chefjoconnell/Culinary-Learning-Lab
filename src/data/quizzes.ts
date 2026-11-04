import type { Lang, Lesson, Question } from './types';
import { getLesson } from './lessons';

export function scoreAnswers(questions: Question[], answers: Record<string, string>): number {
  return questions.filter((q) => answers[q.id] === q.correct).length;
}

export function percent(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function getKnowledgeCheck(lang: Lang, level: 1 | 2 | 3, id: string): Question[] {
  return (getLesson(lang, level, id) as Lesson | undefined)?.knowledgeCheck ?? [];
}

/** Deterministic daily pick so everyone sees the same question on the same local day. */
export function dailyIndex(length: number, date = new Date()): number {
  if (length <= 0) return 0;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return day % length;
}
