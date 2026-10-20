// Placeholder aggregation over feedback returned by the provider.
// The scoring owner can replace this without touching UI components.
import type { Attempt, SessionResults, TopicId } from "./types";

export function computeResults(attempts: Attempt[]): SessionResults {
  const correct = attempts.filter((a) => a.feedback.isCorrect).length;
  const total = attempts.length;
  const map = new Map<TopicId, { correct: number; total: number }>();
  for (const a of attempts) {
    const t = map.get(a.question.topicId) ?? { correct: 0, total: 0 };
    t.total += 1;
    if (a.feedback.isCorrect) t.correct += 1;
    map.set(a.question.topicId, t);
  }
  return {
    correct,
    incorrect: total - correct,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    byTopic: [...map].map(([topicId, v]) => ({ topicId, ...v })),
  };
}

export function weakTopics(attempts: Attempt[]): TopicId[] {
  return computeResults(attempts)
    .byTopic.filter((t) => t.correct < t.total)
    .map((t) => t.topicId);
}
