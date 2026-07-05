export type Difficulty = "easy" | "medium" | "hard";

export type TopicSlug =
  | "journal-entries"
  | "taxes"
  | "financial-statements"
  | "depreciation"
  | "cash-flow"
  | "mixed";

export type JournalEntry = {
  debit: string;
  credit: string;
  amount: number;
};

export type Exercise = {
  id: string;
  topic: TopicSlug;
  difficulty: Difficulty;
  visibleCaseText: string;
  hiddenSolution: string;
  expectedCalculations: Record<string, number | string>;
  expectedJournalEntries: JournalEntry[];
  gradingRubric: string[];
  createdAt: string;
};

export type Topic = {
  slug: TopicSlug | "test";
  title: string;
  description: string;
  subtopics: string[];
};

export type UserAnswer = {
  calculation: string;
  journalEntry: string;
};

export type GradeResult = {
  score: number;
  maxScore: number;
  correct: boolean;
  feedback: string;
  details: string[];
};

export type TopicSettings = {
  enabled: boolean;
  difficulty: Difficulty;
  enabledSubtopics: Record<string, boolean>;
};

export type AppSettings = {
  topics: Record<TopicSlug, TopicSettings>;
  localAiEnabled: boolean;
};

export type ProgressEntry = {
  attempted: number;
  correct: number;
  incorrect: number;
  lastPractice?: string;
};

export type StoredDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  file?: Blob;
  text: string;
  tags: string[];
};
