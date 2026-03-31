# Prompt: Implement Feature

Use this prompt to start a feature implementation session with Claude Code.

---

**Prompt template:**

```
Read `specs/features/<feature>.md`, `specs/architecture.md`, and `specs/api.md`.

Implement the feature according to the spec:
- Follow each acceptance criterion exactly — no more, no less
- Use the stack defined in `specs/architecture.md`: vanilla HTML/CSS/JS, ES modules, no framework
- All API calls must go through `js/api.js`
- Tooltip/copy strings go in `js/copy.js`, not inline
- Do not build anything listed in the "Out of scope" section
- Write tests alongside the implementation (plain JS test file, or use the existing test harness)

Start by listing the files you will create or modify, then wait for my approval before writing any code.
```

---

**Checklist before opening a PR:**
1. All acceptance criteria are checked off in the spec
2. No new files outside the spec scope
3. `js/api.js` is the only place that calls `fetch()`
4. New filter copy/tooltips are added to `js/copy.js`
5. Run `prompts/review.md` prompt and resolve all BLOCKERs
