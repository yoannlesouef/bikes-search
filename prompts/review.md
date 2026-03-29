# Prompt: Code Review

```
Review the changes in the current branch against `specs/features/<feature>.md`.

Check:
1. All acceptance criteria are met
2. No code was added outside the spec scope
3. Edge cases from the spec are handled
4. No obvious security issues (injection, auth bypass, data leaks)
5. Tests cover the acceptance criteria

Report findings as: [BLOCKER] / [SUGGESTION] / [PASS]
```
