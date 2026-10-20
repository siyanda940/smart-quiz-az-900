import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getTopic } from "@/quiz/topics";
import { useQuizSession } from "@/quiz/session-store";
import { AnswerOptionCard, buttonClass, Card, DemoBadge, EmptyState, FeedbackPanel, ProgressBar, type OptionState } from "@/components/quiz/ui";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz in progress | Smart Quiz AZ-900" },
      { name: "description", content: "Answer AZ-900 practice questions and get instant feedback." },
      { property: "og:title", content: "Quiz | Smart Quiz AZ-900" },
      { property: "og:description", content: "AZ-900 practice quiz." },
    ],
  }),
  component: QuizScreen,
});

const LETTERS = ["A", "B", "C", "D"];

function QuizScreen() {
  const { current, submit, next, exit } = useQuizSession();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setSelected(null), [current?.index, current?.id]);
  useEffect(() => {
    if (current?.status === "complete") navigate({ to: "/results" });
  }, [current?.status, navigate]);

  if (!current || current.status !== "active") {
    return (
      <EmptyState
        title="No quiz in progress"
        body="Pick a topic and quiz length to begin."
        action={<Link to="/setup" className={buttonClass("primary")}>Start Practising</Link>}
      />
    );
  }

  const q = current.questions[current.index];
  const attempt = current.attempts[current.index];
  const feedback = attempt?.feedback ?? null;
  const isLast = current.index + 1 === current.questions.length;
  const progress = ((current.index + (feedback ? 1 : 0)) / current.questions.length) * 100;

  const stateFor = (id: string): OptionState => {
    if (!feedback) return selected === id ? "selected" : "idle";
    if (id === feedback.correctOptionId) return "correct";
    if (id === attempt.selectedOptionId) return "incorrect";
    return "dimmed";
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent">{getTopic(q.topicId).title}</p>
          <p className="text-sm text-subtle">Question {current.index + 1} of {current.questions.length}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Exit this quiz? Your answers in this quiz won't be saved.")) {
              exit();
              navigate({ to: "/" });
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-subtle hover:bg-surface hover:text-foreground"
        >
          <X className="h-4 w-4" /> Exit quiz
        </button>
      </div>

      <Card className="p-6 sm:p-8">
        <ProgressBar value={progress} label="Quiz progress" />
        <div className="mt-6 flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold leading-snug sm:text-2xl">{q.text}</h1>
          {q.isDemo && <DemoBadge />}
        </div>

        <div role="radiogroup" aria-label="Answer options" className="mt-6 space-y-3">
          {q.options.map((o, i) => (
            <AnswerOptionCard key={o.id} letter={LETTERS[i]} text={o.text} state={stateFor(o.id)} disabled={!!feedback} onSelect={() => setSelected(o.id)} />
          ))}
        </div>

        <div className="mt-6">
          <FeedbackPanel feedback={feedback} correctText={feedback ? q.options.find((o) => o.id === feedback.correctOptionId)?.text : undefined} />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!feedback ? (
            <button type="button" disabled={!selected} onClick={() => selected && submit(selected)} className={buttonClass("card")}>
              Submit Answer
            </button>
          ) : (
            <button type="button" onClick={next} className={buttonClass("card")} autoFocus>
              {isLast ? "See Results" : "Next Question"}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
