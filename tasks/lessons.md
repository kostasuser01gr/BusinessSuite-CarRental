# Lessons Learned

## 2026-03-22
- Prior task artifacts contained stale claims; reconcile repository task files against current command evidence before using them as proof.
- Vercel repo-link flow mutates local metadata; keep repository cleanliness by excluding local platform metadata rather than committing it blindly.
- Railway CLI can appear capable of repo-backed creation but still fail at the platform integration boundary with `repo not found`; treat that as an external blocker, not as proof that a local workaround is allowed.
- A failing dashboard Notes test here represented two issues: a real draft-rendering defect and a stale test expectation. Separate product bugs from test-contract drift before choosing the fix.
- Backend supertest failures inside the sandbox were environmental; rerunning under escalated execution was necessary to classify them correctly.

## Prevention Rules
- Do not trust inherited task files without revalidation.
- Do not continue deployment once a platform source-of-truth rule is violated or unverifiable.
- Capture exact blocking commands and outputs before attempting adjacent remediation.
