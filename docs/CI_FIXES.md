# CI GitHub Actions Fixes

This document summarizes all the fixes applied to resolve GitHub Actions CI failures.

## Issues Fixed

### 1. ✅ Lint Command Error

**Error:**
```
Invalid project directory provided, no such directory: /home/runner/work/reelporn-frontend/reelporn-frontend/lint
error: unknown option '--dir'
```

**Root Cause:** Next.js beta doesn't support the `--dir` flag for the lint command.

**Fix:** Removed the `--dir .` flag from lint scripts in `package.json`.

**Files Changed:**
- `package.json:9-10`
  ```json
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  ```

### 2. ✅ Cypress Action Lockfile Error

**Error:**
```
Action failed. Missing package manager lockfile. Expecting one of package-lock.json (npm), pnpm-lock.yaml (pnpm) or yarn.lock (yarn)
```

**Root Cause:** `cypress-io/github-action@v6` doesn't recognize Bun's `bun.lockb` file.

**Fix:** Added `install: false` to skip Cypress action's dependency installation since Bun already installed dependencies in a previous step.

**Files Changed:**
- `.github/workflows/ci-tests.yml:49`
  ```yaml
  - name: Run Cypress E2E tests
    uses: cypress-io/github-action@v6
    with:
      install: false  # ← Added this
      build: bun run build
      start: bun run start
  ```

### 3. ✅ Cypress BaseURL Mismatch

**Error:**
```
Cypress could not verify that this server is running:
  > http://localhost:5173
```

**Root Cause:** Cypress config had `baseUrl: 'http://localhost:5173'` (Vite's default port), but Next.js production server runs on port 3000.

**Fix:** Changed baseUrl to `http://localhost:3000` with environment variable support.

**Files Changed:**
- `cypress.config.ts:5`
  ```typescript
  baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
  ```

### 4. ⚠️ Code Coverage - Not Implemented (Documented)

**Issue:** User requested code coverage, but Next.js 16 beta with Turbopack doesn't support Babel-based code instrumentation.

**Attempted:**
- Babel instrumentation with `@cypress/code-coverage` → Build errors
- Disabling Turbopack → Not straightforward in Next.js 16 beta

**Resolution:** Created comprehensive documentation in `docs/CODE_COVERAGE.md` explaining:
- Why coverage isn't currently enabled
- What was attempted
- Future implementation options when Next.js/Turbopack support improves
- Current quality assurance alternatives (tests, linting, type-checking)

**Files Changed:**
- Created `docs/CODE_COVERAGE.md`

## Summary of File Changes

| File | Status | Description |
|------|--------|-------------|
| `package.json` | ✅ Modified | Fixed lint scripts |
| `cypress.config.ts` | ✅ Modified | Fixed baseUrl to port 3000 |
| `.github/workflows/ci-tests.yml` | ✅ Modified | Added `install: false` to Cypress action |
| `docs/CODE_COVERAGE.md` | ✅ Created | Code coverage documentation |
| `docs/CI_FIXES.md` | ✅ Created | This file |

## CI Jobs Status

All CI jobs should now pass:

- ✅ **cypress-tests** - E2E tests with Cypress
- ✅ **type-check** - TypeScript type checking
- ✅ **lint** - ESLint code quality checks
- ✅ **build** - Production build

## Testing Locally

To verify fixes locally:

```bash
# Lint
docker exec reelporn_frontend bun run lint

# Type check
docker exec reelporn_frontend bun run type-check

# Build
docker exec reelporn_frontend bun run build

# Cypress E2E tests (requires running server)
docker exec reelporn_frontend bun run build
docker exec reelporn_frontend bun run start &
docker exec reelporn_frontend bun run cypress:run
```

## Next Steps

1. **Commit and push changes** to trigger CI
2. **Monitor GitHub Actions** to confirm all jobs pass
3. **Add code coverage later** when Next.js/Turbopack support improves (see `docs/CODE_COVERAGE.md`)
