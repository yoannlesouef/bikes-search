# Prompt: Debug

Use this prompt when reporting a bug to Claude Code.

---

**Prompt template:**

```
I have a bug. Here is what I expected: [EXPECTED]
Here is what actually happens: [ACTUAL]
Relevant error or log: [ERROR]

File and line (if known): [FILE:LINE]

Steps to reproduce:
1. [STEP]
2. [STEP]

Before suggesting a fix:
1. Identify the root cause — read the relevant file(s) first
2. Explain why it happens
3. Propose the minimal fix — do not refactor surrounding code
4. If the bug reveals a gap in a spec, note the spec file and line
```
