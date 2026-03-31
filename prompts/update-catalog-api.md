# Prompt: Adapt to Catalog API Changes

Use this prompt when the SaaS bike catalog API contract changes and the frontend needs to be updated.

---

**Prompt template:**

```
The bike catalog API has changed. Here is the diff / changelog: [PASTE CHANGELOG OR DIFF]

Read `specs/api.md` and `js/api.js`.

1. Identify all frontend code that is affected by the API change
2. List every file and function that needs to change
3. Propose the minimal update — do not refactor unrelated code
4. Update `specs/api.md` to reflect the new contract
5. Wait for my approval before writing any code

Do not change feature behaviour — only update the API integration layer.
```
