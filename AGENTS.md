<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Quiz UI talks to questions only through the `QuizProvider` contract in src/quiz/types.ts (swap in src/quiz/provider.ts); UI never sees correct answers before submit, so the bank/validation owner can replace demo data without UI changes.
- Quiz session state lives only in src/quiz/session-store.tsx (in-memory context) so screens never duplicate state.
