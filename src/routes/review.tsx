import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useQuizSession } from "@/quiz/session-store";
import { getTopic } from "@/quiz/topics";
import { AnswerOptionCard, buttonClass, Card, EmptyState, FeedbackPanel } from "@/components/quiz/ui";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review mistakes | Smart Quiz AZ-900" },
      { name: "description", content: "Revisit the AZ-900 questions you got wrong, with explanations." },
      { property: "og:title", content: "Review mistakes | Smart Quiz AZ-900" },
      { property: "og:description", content: "Learn from your AZ-900 mistakes." },
    ],
  }),
  component: Review,
});

const LETTERS = ["A", "B", "C", "D"];

function Review() {
  const { completed } = useQuizSession();
  const mistakes = completed.at(-1)?.attempts.filter((a) => !a.feedback.isCorrect) ?? [];

  if (!mistakes.length) {
    return <EmptyState title="No mistakes to review" body="Complete a quiz first — any questions you miss will appear here with explanations." action={<Link to="/" className={buttonClass("primary")}>Return to Dashboard</Link>} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/results" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to results
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Review mistakes</h1>
      <div className="mt-6 space-y-6">
        {mistakes.map((a) => (
          <Card key={a.question.id} className="p-6">
            <p className="text-xs font-semibold text-primary">{getTopic(a.question.topicId).title}</p>
            <h2 className="mt-2 text-lg font-bold">{a.question.text}</h2>
            <div className="mt-4 space-y-2">
              {a.question.options.map((o, i) => (
                <AnswerOptionCard
                  key={o.id}
                  letter={LETTERS[i]}
                  text={o.text}
                  disabled
                  onSelect={() => {}}
                  state={o.id === a.feedback.correctOptionId ? "correct" : o.id === a.selectedOptionId ? "incorrect" : "dimmed"}
                />
              ))}
            </div>
            <div className="mt-4">
              <FeedbackPanel feedback={a.feedback} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
