/**
 * Integration contract between the UI and the question bank / scoring logic.
 * The UI only ever sees `PublicQuestion` (no correct answer). Correctness and
 * explanations come back from `QuizProvider.submitAnswer` after submission.
 */
export type TopicId = "cloud-concepts" | "architecture-services" | "management-governance";

export interface Topic {
  id: TopicId;
  title: string;
  summary: string;
  examWeight: string;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface PublicQuestion {
  id: string;
  topicId: TopicId;
  text: string;
  options: AnswerOption[]; // exactly four, rendered A–D
  isDemo?: boolean;
}

export interface AnswerFeedback {
  questionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
}

export interface QuizProvider {
  countAvailable(topicIds: TopicId[]): number;
  getQuestions(topicIds: TopicId[], count: number): PublicQuestion[];
  submitAnswer(questionId: string, selectedOptionId: string): AnswerFeedback;
}

export interface Attempt {
  question: PublicQuestion;
  selectedOptionId: string;
  feedback: AnswerFeedback;
}

export interface QuizSession {
  id: string;
  topicIds: TopicId[];
  questions: PublicQuestion[];
  index: number;
  attempts: Attempt[];
  status: "active" | "complete";
}

export interface TopicResult {
  topicId: TopicId;
  correct: number;
  total: number;
}

export interface SessionResults {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  byTopic: TopicResult[];
}
