# Prompt: Implement Feature

Use this prompt to start a feature implementation session with Claude.

---

**Prompt template:**

```
Read `specs/features/<feature>.md` and `specs/architecture.md`.

Implement the feature according to the spec:
- Follow the acceptance criteria exactly
- Use the stack defined in `specs/architecture.md`
- Do not build anything outside the scope section
- Write tests alongside the implementation

Start by listing the files you will create or modify, then wait for my approval before writing code.
```
