import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { quizProvider } from "./provider";
import type { QuizSession, TopicId } from "./types";

/** Single source of truth for quiz sessions. In-memory only (cleared on reload). */
interface Store {
  current: QuizSession | null;
  completed: QuizSession[];
  start: (topicIds: TopicId[], count: number) => void;
  submit: (optionId: string) => void;
  next: () => void;
  exit: () => void;
}

const Ctx = createContext<Store | null>(null);

export function QuizSessionProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<QuizSession | null>(null);
  const [completed, setCompleted] = useState<QuizSession[]>([]);

  const start = useCallback((topicIds: TopicId[], count: number) => {
    setCurrent({
      id: crypto.randomUUID(),
      topicIds,
      questions: quizProvider.getQuestions(topicIds, count),
      index: 0,
      attempts: [],
      status: "active",
    });
  }, []);

  const submit = useCallback((optionId: string) => {
    setCurrent((s) => {
      if (!s || s.attempts.length > s.index) return s;
      const question = s.questions[s.index];
      const feedback = quizProvider.submitAnswer(question.id, optionId);
      return { ...s, attempts: [...s.attempts, { question, selectedOptionId: optionId, feedback }] };
    });
  }, []);

  const next = useCallback(() => {
    setCurrent((s) => {
      if (!s || s.attempts.length <= s.index) return s;
      if (s.index + 1 >= s.questions.length) {
        const done = { ...s, status: "complete" as const };
        setCompleted((c) => [...c, done]);
        return done;
      }
      return { ...s, index: s.index + 1 };
    });
  }, []);

  const exit = useCallback(() => setCurrent((s) => (s?.status === "active" ? null : s)), []);

  const value = useMemo(
    () => ({ current, completed, start, submit, next, exit }),
    [current, completed, start, submit, next, exit],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuizSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useQuizSession must be used inside QuizSessionProvider");
  return v;
}
