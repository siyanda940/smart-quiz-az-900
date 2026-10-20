import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuizSession } from "@/quiz/session-store";
import { computeResults, weakTopics } from "@/quiz/scoring";
import { topicsLabel } from "@/quiz/topics";
import { buttonClass, EmptyState, ResultsSummary } from "@/components/quiz/ui";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your results | Smart Quiz AZ-900" },
      { name: "description", content: "See your AZ-900 quiz score and topic performance." },
      { property: "og:title", content: "Results | Smart Quiz AZ-900" },
      { property: "og:description", content: "Your AZ-900 practice results." },
    ],
  }),
  component: Results,
});

function Results() {
  const { completed } = useQuizSession();
  const navigate = useNavigate();
  const last = completed.at(-1);

  if (!last) {
    return (
      <EmptyState
        title="No completed quizzes yet"
        body="Finish a quiz to see your score, correct and incorrect answers, and how you did on each topic."
        action={<Link to="/setup" className={buttonClass("primary")}>Start Practising</Link>}
      />
    );
  }

  const results = computeResults(last.attempts);
  const weak = weakTopics(last.attempts);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-accent">{topicsLabel(last.topicIds)}</p>
      <h1 className="mt-1 text-3xl font-bold">Quiz complete</h1>
      <div className="mt-6">
        <ResultsSummary results={results} />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={results.incorrect === 0} onClick={() => navigate({ to: "/review" })} className={buttonClass("primary")}>
          Review Mistakes
        </button>
        <button type="button" disabled={weak.length === 0} onClick={() => navigate({ to: "/setup", search: { topics: weak.join(",") } })} className={buttonClass("secondary")}>
          Practise Weak Topics
        </button>
        <Link to="/" className={buttonClass("secondary")}>Return to Dashboard</Link>
      </div>
      {results.incorrect === 0 && <p className="mt-3 text-sm text-subtle">Perfect score — no mistakes or weak topics to revisit.</p>}
    </div>
  );
}
