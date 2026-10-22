
import questionBank from "../data/questions.json";
import type {
  AnswerFeedback,
  BankQuestion,
  PublicQuestion,
  QuizProvider,
  TopicId,
} from "./types";

const QUESTIONS = questionBank as BankQuestion[];
console.log("Questions loaded:", QUESTIONS.length);
console.log(
  "Questions by topic:",
  QUESTIONS.reduce((counts, q) => {
    counts[q.topic] = (counts[q.topic] || 0) + 1;
    return counts;
  }, {} as Record<string, number>)
);

function validateQuestionBank(bank: BankQuestion[]): void {
  const ids = new Set<string>();
  const validTopics: TopicId[] = [
    "cloud-concepts",
    "architecture-services",
    "management-governance",
  ];
  const validDifficulties = ["easy", "medium", "hard"];

  if (bank.length === 0) {
    throw new Error("The question bank is empty.");
  }

  for (const question of bank) {
    if (!question.id || ids.has(question.id)) {
      throw new Error(`Missing or duplicate question ID: ${question.id}`);
    }
    ids.add(question.id);

    if (!validTopics.includes(question.topic)) {
      throw new Error(`Invalid topic for question ${question.id}`);
    }

    if (!question.question?.trim()) {
      throw new Error(`Question ${question.id} has no question text.`);
    }

    if (!validDifficulties.includes(question.difficulty)) {
      throw new Error(`Invalid difficulty for question ${question.id}`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Question ${question.id} must have exactly 4 options.`);
    }

    const optionIds = new Set(question.options.map((option) => option.id));

    if (
      optionIds.size !== 4 ||
      !optionIds.has(question.correctOptionId)
    ) {
      throw new Error(`Invalid options or correct answer for ${question.id}`);
    }

    if (
      question.options.some(
        (option) => !option.text?.trim() || !option.explanation?.trim(),
      ) ||
      !question.explanation?.trim()
    ) {
      throw new Error(`Missing explanation for question ${question.id}`);
    }
  }
}

validateQuestionBank(QUESTIONS);

const toPublicQuestion = (question: BankQuestion): PublicQuestion => ({
  id: question.id,
  topicId: question.topic,
  text: question.question,
  subtopic: question.subtopic,
  difficulty: question.difficulty,
  options: question.options.map(({ id, text }) => ({ id, text })),
});

export const quizProvider: QuizProvider = {
  countAvailable: (topicIds) =>
    QUESTIONS.filter((question) => topicIds.includes(question.topic)).length,

  getQuestions: (topicIds, count) => {
    const pool = QUESTIONS.filter((question) =>
      topicIds.includes(question.topic),
    );

    // Shuffle without modifying the original question bank.
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const current = pool[i]!;
  const other = pool[j]!;

  pool[i] = other;
  pool[j] = current;
}
    return pool.slice(0, count).map(toPublicQuestion);
  },

  submitAnswer: (questionId, selectedOptionId): AnswerFeedback => {
    const question = QUESTIONS.find((item) => item.id === questionId);

    if (!question) {
      throw new Error(`Unknown question: ${questionId}`);
    }

    return {
      questionId,
      isCorrect: question.correctOptionId === selectedOptionId,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    };
  },
};

export const USING_DEMO_QUESTIONS = false;
