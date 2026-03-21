# Verification Suite Guide

This document outlines the standard verification procedures for the AdaptiveAI Business Suite.

## 🧪 Automated Testing

### Unit & Integration Tests (Vitest)
These tests cover component behavior, providers, and backend logic.
```bash
npm test
```

### End-to-End Tests (Playwright)
These tests cover full user journeys in a real browser.
```bash
npm run test:e2e
```
*Note: Ensure the dev servers are running or configured in playwright.config.ts.*

## 🏗️ Production Readiness Checks

Run the following commands sequentially to ensure the project is ready for deployment:

1. **Type Checking:**
   ```bash
   npm run typecheck
   ```
2. **Linting:**
   ```bash
   npm run lint
   ```
3. **Building:**
   ```bash
   npm run build
   ```
4. **Full Verification Script:**
   ```bash
   npm run verify
   ```

## 📋 Core Flows Covered

- **Authentication:** Signup, Login, Logout, Protected Routing.
- **Dashboard:** KPI rendering, Task CRUD, Note management (pinning/editing).
- **Operations:** Customers list/detail, Booking flows, Asset health monitoring.
- **Personalization:** Theme switching, Layout density, Widget reordering.
- **Security:** Session hardening, WebAuthn foundation readiness.

## 🛠️ Test Stability

- Use `data-testid` for targeting elements in E2E tests.
- Use `aria-label` for action buttons to ensure accessibility and testability.
- Avoid time-dependent tests without proper wait logic or mocking.
