export type Lang = 'en' | 'es';

export interface QuizOption { id: string; text: string }
export interface Question {
  id: string;
  type: 'multiple-choice';
  stem: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
}
export interface Scenario { id: string; title: string; situation: string; questions: Question[] }
export interface Lesson {
  id: string;
  unit: string;
  title: string;
  summary: string;
  objective: string;
  cip: string;
  canvasPath: string;
  status: 'demo' | 'verified';
  calculator?: boolean;
  miniLesson: string[];
  definitions: { term: string; text: string }[];
  table: { caption: string; headers: string[]; rows: string[][] };
  scenarios?: Scenario[];
  knowledgeCheck: Question[];
  exitTicket: { prompt: string };
  reflection: string;
}
export interface LevelContent {
  level: 1 | 2 | 3;
  title: string;
  overview: string;
  pathway: string[];
  nextSteps: string[];
  canvasPath: string;
  plannedUnits: { id: string; title: string }[];
  units: Lesson[];
}
