// Swap this single export for the real question bank + validator when ready.
import { demoProvider } from "./demo/demo-provider";
import type { QuizProvider } from "./types";

export const quizProvider: QuizProvider = demoProvider;
export const USING_DEMO_QUESTIONS = true;
