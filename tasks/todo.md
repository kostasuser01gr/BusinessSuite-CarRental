# AdaptiveAI-BusinessSuite Execution Plan

## Modes
- `release`
- `hardening`
- `audit`

## Current Phase
- Phase 5: push hardened local fixes and finalize blocker documentation

## Plan
1. Refresh baseline environment checks required by `AGENTS.md`.
2. Reconcile repository state, branch, remote, and pushed commit.
3. Discover topology, critical surfaces, command map, environment map, and deployment paths.
4. Commit and push minimum deployment config needed for GitHub-backed deployment.
5. Validate GitHub state and inspect platform linkage through CLI only.
6. Run feasible local validation layers and mandatory machine checks.
7. Isolate remaining external blockers and produce evidence-backed handoff.

## Checklist
- [x] Required baseline commands refreshed
- [x] Git remote, branch, clean-tree, and pushed-state verified
- [x] Deployment config validated and committed
- [x] Deployment config pushed to GitHub
- [x] GitHub repo/default branch/latest SHA confirmed
- [x] Vercel repo-aware project link attempted and succeeded
- [ ] Vercel environment variables configured
- [ ] Vercel GitHub-backed production deployment confirmed
- [ ] Railway GitHub-backed service creation confirmed
- [ ] Railway environment variables configured
- [ ] Railway GitHub-backed deployment confirmed
- [x] Local lint/typecheck/build/test matrix rerun for current commit
- [ ] Mandatory `AGENTS.md` post-modification checks completed

## Blockers
- `B001` Railway CLI rejects repo-backed service creation:
  `railway add --service business-suite-backend --repo kostasuser01gr/BusinessSuite-CarRental`
  output: `repo not found`
- `B002` No GitHub Actions workflows are committed under `.github/workflows`, so remote CI validation is unavailable.
- `B003` Vercel deployment cannot be truthfully completed until backend repo-backed URL exists and required env vars are set.

## Blast Radius Notes
- `vercel.json` affects frontend build/release behavior.
- `railway.json` affects backend build/start/health behavior.
- Split deployment path couples frontend `VITE_API_URL` to backend public URL and backend `VITE_CLIENT_URL` to frontend public URL.

## Validation Map
- Dependency integrity: partial, lockfile present and installable state already materialized locally; audit not rerun
- Static hygiene: `npm run lint` passed
- Type safety: `npm run typecheck` passed
- Build integrity: `npm run build` passed with a frontend chunk-size warning
- Backend live validation: local backend tests passed under escalated execution
- Frontend live validation: local frontend tests passed under escalated execution
- Deployment validation: blocked externally at Railway repo linkage
- Remote CI validation: unavailable because no workflows are committed

## Topology Map
- Repository type: single-package app repo with split frontend/backend deployment
- Frontend app: Vite React app rooted at `client/`
- Backend service: Express service rooted at `server/`
- Shared modules: `shared/`
- Tests: Vitest in `test/`, Playwright in `e2e/`
- Static public assets: `public/`
- Scripts: `scripts/verify.sh`

## Environment Map
- Local dev frontend: Vite on port `3100`
- Local dev backend: Express on port `5000`
- Backend required env: `SESSION_SECRET`, `NODE_ENV`, `VITE_CLIENT_URL`
- Frontend required env: `VITE_API_URL`
- Optional backend env: `DATABASE_URL`

## Time Budget
- Discovery and repo verification: budget 20m, actual ~20m
- Deployment-path setup: budget 30m, actual ~55m
- Local validation rerun: budget 25m, actual pending
- Blocker isolation and reporting: budget 15m, actual in progress

## Results Summary
- Current base commit already on `main`: `53f7b019bcafbef747249dd6b3015bf6359ef501`
- GitHub repository is the canonical source of truth for the deployable config.
- Vercel project creation via repo-aware CLI path succeeded.
- Railway remains externally blocked because the platform does not currently resolve the GitHub repo for repo-backed service creation.
- Local validation results after hardening:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run build`: pass, with large bundle warning on `dist/client/assets/index-DvTdbxhA.js`
  - `npm run test`: pass under escalated execution after fixing the Notes lifecycle defect and stale test expectation
- Mandatory machine checks:
  - `curl -s http://127.0.0.1:11434/api/version`: pass
  - `ollama list`: pass
  - `ollama-health`: anomaly, MLX crash stack during model inspection
  - `ollama-logs`: pass
  - `claude-ultra -h | head`: pass
