import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { parseTopics, topicsLabel } from "@/quiz/topics";
import { quizProvider, USING_DEMO_QUESTIONS } from "@/quiz/provider";
import { useQuizSession } from "@/quiz/session-store";
import { buttonClass, Card } from "@/components/quiz/ui";

const COUNTS = [5, 10, 15];

export const Route = createFileRoute("/setup")({
  validateSearch: (s: Record<string, unknown>) => ({ topics: typeof s.topics === "string" ? s.topics : undefined }),
  head: () => ({
    meta: [
      { title: "Set up your quiz | Smart Quiz AZ-900" },
      { name: "description", content: "Choose how many AZ-900 practice questions to answer." },
      { property: "og:title", content: "Set up your quiz | Smart Quiz AZ-900" },
      { property: "og:description", content: "Choose a topic and quiz length." },
    ],
  }),
  component: Setup,
});

function Setup() {
  const { topics } = Route.useSearch();
  const topicIds = parseTopics(topics);
  const available = quizProvider.countAvailable(topicIds);
  const [count, setCount] = useState<number | null>(available >= 5 ? 5 : null);
  const { start } = useQuizSession();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <Card className="mt-5 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Selected topic</p>
        <h1 className="mt-2 text-2xl font-bold">{topicsLabel(topicIds)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {available} question{available === 1 ? "" : "s"} available{USING_DEMO_QUESTIONS ? " (demonstration set)" : ""}.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">Number of questions</legend>
          <div role="radiogroup" className="mt-3 grid grid-cols-3 gap-3">
            {COUNTS.map((n) => {
              const ok = n <= available;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={count === n}
                  disabled={!ok}
                  onClick={() => setCount(n)}
                  className={cn(
                    "rounded-xl border-2 py-4 font-display text-xl font-bold transition-all disabled:cursor-not-allowed disabled:opacity-35",
                    count === n ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:border-primary",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {available < 15 && <p className="mt-2 text-xs text-muted-foreground">Longer quizzes unlock when more questions are available.</p>}
        </fieldset>

        <button
          type="button"
          disabled={!count}
          onClick={() => {
            if (!count) return;
            start(topicIds, count);
            navigate({ to: "/quiz" });
          }}
          className={buttonClass("card") + " mt-8 w-full py-4 text-base"}
        >
          Start Quiz
        </button>
        {available < 5 && <p className="mt-3 text-sm text-destructive">Not enough questions for this topic yet.</p>}
      </Card>
    </div>
  );
}
