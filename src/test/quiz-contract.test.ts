import { describe, expect, it } from "vitest";
import { demoProvider } from "@/quiz/demo/demo-provider";

describe("question contract", () => {
  it("questions sent to the UI never include the correct answer", () => {
    const qs = demoProvider.getQuestions(["cloud-concepts"], 5);
    expect(qs).toHaveLength(5);
    for (const q of qs) {
      expect(q).not.toHaveProperty("correctOptionId");
      expect(q).not.toHaveProperty("explanation");
      expect(q.options).toHaveLength(4);
    }
  });
});
