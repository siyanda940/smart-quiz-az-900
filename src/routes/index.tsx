import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TOPICS } from "@/quiz/topics";
import { useQuizSession } from "@/quiz/session-store";
import { computeResults } from "@/quiz/scoring";
import { buttonClass, Card, EmptyState, ProgressBar, TopicCard } from "@/components/quiz/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Quiz — AZ-900 Exam Prep | Dashboard" },
      { name: "description", content: "Study smarter for AZ-900. Practise cloud, architecture and governance questions and learn from every mistake." },
      { property: "og:title", content: "Smart Quiz — AZ-900 Exam Prep" },
      { property: "og:description", content: "Practise AZ-900 concepts and understand every answer." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { completed } = useQuizSession();
  const all = completed.flatMap((s) => s.attempts);
  const results = computeResults(all);

  return (
    <div className="space-y-14">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">AZ-900 · Microsoft Azure Fundamentals</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Study smarter. <span className="text-brand">Understand every answer.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-subtle">
          Practise the core AZ-900 concepts with focused quizzes, get an explanation after every answer and turn your mistakes into what you know best.
        </p>
        <Link to="/setup" className={buttonClass("primary") + " mt-8 px-7 py-4 text-base"}>
          Start Practising <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <section aria-labelledby="topics">
        <h2 id="topics" className="text-2xl font-bold">Exam topics</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {TOPICS.map((t, i) => (
            <TopicCard key={t.id} topic={t} index={i} />
          ))}
        </div>
      </section>

      <section aria-labelledby="progress">
        <h2 id="progress" className="text-2xl font-bold">Your progress</h2>
        <div className="mt-5">
          {completed.length === 0 ? (
            <EmptyState
              title="No quizzes completed yet"
              body="Finish your first quiz and your score and topic breakdown will appear here. Progress is kept only while this tab is open."
            />
          ) : (
            <Card className="grid gap-6 p-6 sm:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground">Quizzes completed</div>
                <div className="font-display text-3xl font-bold">{completed.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Questions answered</div>
                <div className="font-display text-3xl font-bold">{results.total}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Overall accuracy</div>
                <div className="font-display text-3xl font-bold">{results.percentage}%</div>
                <div className="mt-2"><ProgressBar value={results.percentage} label="Overall accuracy" /></div>
              </div>
              <p className="text-xs text-muted-foreground sm:col-span-3">This session only — progress resets when you reload the page.</p>
            </Card>
          )}
        </div>
      </section>

      <p className="border-t border-surface-border/60 pt-6 text-xs text-subtle">
        Smart Quiz is an unofficial study tool and is not affiliated with or endorsed by Microsoft.
      </p>
    </div>
  );
}
