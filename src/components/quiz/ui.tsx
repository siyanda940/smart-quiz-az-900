import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AnswerFeedback, SessionResults, Topic } from "@/quiz/types";
import { getTopic } from "@/quiz/topics";

export function AppHeader() {
  return (
    <header className="border-b border-surface-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Smart Quiz <span className="text-subtle font-medium">· AZ-900</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="rounded-lg px-3 py-2 text-subtle hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
            Dashboard
          </Link>
          <Link to="/results" className="rounded-lg px-3 py-2 text-subtle hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Results
          </Link>
        </nav>
      </div>
    </header>
  );
}

const btn = {
  primary: "bg-brand text-primary-foreground shadow-glow hover:brightness-110",
  secondary: "bg-surface text-foreground border border-surface-border hover:border-accent",
  card: "bg-primary text-primary-foreground hover:brightness-110",
  ghost: "text-muted-foreground hover:text-card-foreground hover:bg-muted",
};
export function buttonClass(v: keyof typeof btn = "primary") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    btn[v],
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-card text-card-foreground shadow-card", className)}>{children}</div>;
}

export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  return (
    <Link
      to="/setup"
      search={{ topics: topic.id }}
      className="group flex flex-col rounded-2xl bg-card p-6 text-card-foreground shadow-card transition-all hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary font-display font-bold text-secondary-foreground">
          {index + 1}
        </span>
        <span className="text-xs font-medium text-muted-foreground">Exam weight {topic.examWeight}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold leading-snug">{topic.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{topic.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Practise this topic <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export type OptionState = "idle" | "selected" | "correct" | "incorrect" | "dimmed";

export function AnswerOptionCard({ letter, text, state, disabled, onSelect }: { letter: string; text: string; state: OptionState; disabled: boolean; onSelect: () => void }) {
  const styles: Record<OptionState, string> = {
    idle: "border-border hover:border-primary hover:bg-secondary/40",
    selected: "border-primary bg-secondary/60 ring-2 ring-primary/30",
    correct: "border-success bg-success-soft",
    incorrect: "border-destructive bg-destructive-soft",
    dimmed: "border-border opacity-60",
  };
  const badge: Record<OptionState, string> = {
    idle: "bg-muted text-card-foreground",
    selected: "bg-primary text-primary-foreground",
    correct: "bg-success text-primary-foreground",
    incorrect: "bg-destructive text-destructive-foreground",
    dimmed: "bg-muted text-muted-foreground",
  };
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === "selected" || state === "incorrect" || state === "correct"}
      disabled={disabled}
      onClick={onSelect}
      className={cn("flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all disabled:cursor-default", styles[state])}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display font-bold", badge[state])}>{letter}</span>
      <span className="flex-1 text-[15px] font-medium">{text}</span>
      {state === "correct" && <CheckCircle2 className="h-5 w-5 text-success" aria-label="Correct answer" />}
      {state === "incorrect" && <XCircle className="h-5 w-5 text-destructive" aria-label="Your answer, incorrect" />}
    </button>
  );
}

export function FeedbackPanel({ feedback, correctText }: { feedback: AnswerFeedback | null; correctText?: string }) {
  return (
    <div aria-live="polite" className="min-h-[96px]">
      {feedback ? (
        <div className={cn("animate-in fade-in slide-in-from-bottom-2 rounded-xl border-l-4 p-4", feedback.isCorrect ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft")}>
          <p className={cn("flex items-center gap-2 font-display font-bold", feedback.isCorrect ? "text-success" : "text-destructive")}>
            {feedback.isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {feedback.isCorrect ? "Correct" : "Not quite"}
          </p>
          {!feedback.isCorrect && correctText && (
            <p className="mt-1 text-sm">
              Correct answer: <strong>{correctText}</strong>
            </p>
          )}
          <p className="mt-1 text-sm text-card-foreground/80">{feedback.explanation}</p>
        </div>
      ) : (
        <div className="grid h-full min-h-[96px] place-items-center rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground">
          Select an answer and submit to see feedback.
        </div>
      )}
    </div>
  );
}

export function ResultsSummary({ results }: { results: SessionResults }) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="mx-auto grid h-36 w-36 place-items-center rounded-full p-2" style={{ background: `conic-gradient(var(--primary) ${results.percentage * 3.6}deg, var(--muted) 0)` }}>
          <div className="grid h-full w-full place-items-center rounded-full bg-card">
            <div className="text-center">
              <div className="font-display text-4xl font-bold">{results.percentage}%</div>
              <div className="text-xs text-muted-foreground">{results.correct} / {results.total}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Correct" value={results.correct} tone="text-success" />
          <Stat label="Incorrect" value={results.incorrect} tone="text-destructive" />
        </div>
      </div>
      <h3 className="mt-8 font-bold">Topic performance</h3>
      <ul className="mt-3 space-y-4">
        {results.byTopic.map((t) => {
          const pct = Math.round((t.correct / t.total) * 100);
          return (
            <li key={t.topicId}>
              <div className="mb-1.5 flex justify-between gap-4 text-sm">
                <span className="font-medium">{getTopic(t.topicId).title}</span>
                <span className="shrink-0 text-muted-foreground">{t.correct}/{t.total} · {pct}%</span>
              </div>
              <ProgressBar value={pct} label={`${getTopic(t.topicId).title} score`} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <div className={cn("font-display text-3xl font-bold", tone)}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-border bg-surface/60 p-8 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-subtle">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function DemoBadge() {
  return <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">Demo question</span>;
}
