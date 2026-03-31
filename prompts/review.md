# Prompt: Code Review

Use this prompt before merging a feature branch.

---

**Prompt template:**

```
Read `specs/features/<feature>.md` and review the changes on the current branch against it.

Check:
1. All acceptance criteria are implemented and verifiable
2. No code was added outside the "Out of scope" section
3. All edge cases from the spec are handled
4. No direct `fetch()` calls outside `js/api.js`
5. No hardcoded bike data — all data comes from the API
6. No inline tooltip strings — copy lives in `js/copy.js`
7. No obvious security issues (XSS via innerHTML, open redirects, exposed API key)
8. CSS follows the variable system in `css/base.css` — no magic numbers
9. The feature works without JavaScript errors on Chrome, Firefox, and Safari

Report each finding as:
- [BLOCKER] — must fix before merge
- [SUGGESTION] — optional improvement
- [PASS] — criterion met

End with a summary: READY TO MERGE / NEEDS WORK.
```
