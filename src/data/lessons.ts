import { getContent } from './content-loader';
import type { Lang, LevelContent, Lesson } from './types';

export function getLevel(lang: Lang, level: 1 | 2 | 3): LevelContent {
  return getContent<LevelContent>(lang, `level${level}`);
}

export function getAllLessons(lang: Lang): { level: 1 | 2 | 3; lesson: Lesson }[] {
  return ([1, 2, 3] as const).flatMap((level) => getLevel(lang, level).units.map((lesson) => ({ level, lesson })));
}

export function getLesson(lang: Lang, level: 1 | 2 | 3, id: string): Lesson | undefined {
  return getLevel(lang, level).units.find((u) => u.id === id);
}
