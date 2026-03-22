# Decisions

## 2026-03-22
- Added [vercel.json](/Volumes/CORSAIR/Workspace/Projects/AdaptiveAI-BusinessSuite/vercel.json) with the minimum explicit Vite build/output configuration.
  Rationale: the repo had no committed Vercel config, and the deployment flow required GitHub-contained deploy metadata.
  Alternatives rejected: relying on dashboard defaults or uncommitted local project settings.

- Added [railway.json](/Volumes/CORSAIR/Workspace/Projects/AdaptiveAI-BusinessSuite/railway.json) with explicit build/start/health settings.
  Rationale: the repo had no committed Railway config, and the backend deployment path needed explicit build and health behavior in Git.
  Alternatives rejected: relying on platform autodetection without committed configuration.

- Used `vercel link --repo` instead of `vercel --prod`.
  Rationale: the user required GitHub-backed deployment, not a local-directory deployment shortcut.
  Alternatives rejected: `vercel deploy`, `vercel --prod`, or dashboard-only setup.

- Stopped Railway deployment after `railway add --service business-suite-backend --repo kostasuser01gr/BusinessSuite-CarRental` returned `repo not found`.
  Rationale: proceeding with the existing non-repo-backed service would violate the repository source-of-truth rule.
  Alternatives rejected: redeploying the existing `adaptive-ai-backend` service or using a local-source deployment path.

- Updated [client/src/components/dashboard/NotesModule.tsx](/Volumes/CORSAIR/Workspace/Projects/AdaptiveAI-BusinessSuite/client/src/components/dashboard/NotesModule.tsx) so draft notes render even when the persisted notes list is empty.
  Rationale: clicking Add could previously leave the user in an unreachable draft state, and the live component behavior contradicted the expected note lifecycle.
  Alternatives rejected: leaving the defect in place or faking green by weakening the lifecycle test.

- Updated [test/dashboard_modules.test.tsx](/Volumes/CORSAIR/Workspace/Projects/AdaptiveAI-BusinessSuite/test/dashboard_modules.test.tsx) to follow the current note-add UX, which opens directly in edit mode.
  Rationale: the test was asserting an intermediate control that no longer exists in the current UI contract.
  Alternatives rejected: reintroducing an unnecessary intermediate edit button solely to satisfy the old test.

- Updated [test/frontend_auth.test.tsx](/Volumes/CORSAIR/Workspace/Projects/AdaptiveAI-BusinessSuite/test/frontend_auth.test.tsx) to await `AuthProvider` bootstrap in render-only tests.
  Rationale: the previous tests passed with React `act(...)` warnings, which left unclassified anomaly noise in the validation output.
  Alternatives rejected: suppressing warnings or ignoring them as harmless.
