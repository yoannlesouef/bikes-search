# Prompt: Write a Feature Spec

Use this prompt to create a new feature spec before implementation begins.

---

**Prompt template:**

```
I want to add a new feature to the bike search app: [FEATURE DESCRIPTION]

Read `specs/PRD.md`, `specs/architecture.md`, and `specs/data-model.md` for context.

Write a feature spec at `specs/features/<feature-name>.md` using this structure:
- User story (As a [user type], I want to [action] so that [outcome])
- Acceptance criteria (testable, checkbox list)
- Technical notes (implementation constraints, which JS module owns the logic)
- Edge cases (explicit list)
- Out of scope (explicit list)

Rules:
- Acceptance criteria must be independently verifiable — avoid vague criteria like "the UI looks good"
- Reference existing modules (js/api.js, js/filters.js, etc.) where relevant
- Do not design API changes unless the current API spec cannot support the feature
- Keep scope minimal — one user story per spec

Show me the draft spec and wait for my approval before saving the file.
```
