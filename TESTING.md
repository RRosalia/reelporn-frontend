# Testing Guide - Cypress E2E Tests

## Quick Links

- 📹 **Just want to see what happens?** → [Video Recording Method](#method-1-video-recording-easiest)
- 🎮 **Want interactive control?** → [Cypress UI Method](#method-2-cypress-ui-interactive)
- 🚀 **Just want fast results?** → [Headless Method](#method-3-headless-fastest)

---

## Initial Setup (One-Time)

First time? You need to rebuild the Docker container with Cypress dependencies:

```bash
# From the project root
cd /Users/rhenusonerosalia/projects/rhenusone/reelporn

# Rebuild the frontend container
docker-compose stop frontend
docker-compose build frontend
docker-compose up -d frontend
```

---

## Method 1: Video Recording (Easiest)

**Best for:** Daily development, reviewing test behavior, sharing with team

Tests automatically record videos that you can watch afterward.

### Run Tests with Video

```bash
docker exec reelporn_frontend bun run test:e2e
```

### Watch the Videos

```bash
# Videos are saved to cypress/videos/
open cypress/videos/age-verification.cy.ts.mp4
```

**That's it!** No setup required, works everywhere.

### Example Output

```
  Age Verification Widget
    ✓ should display age verification modal on first visit
    ✓ should hide page content when modal is displayed
    ✓ should allow entry when clicking "Enter" button (18+)
    ...

  60 passing (45s)

  - Video recorded: cypress/videos/age-verification.cy.ts.mp4
```

---

## Method 2: Cypress UI (Interactive)

**Best for:** Debugging failures, developing new tests, exploring test behavior

Opens the full Cypress Test Runner where you can:
- Pick which tests to run
- Watch tests execute in real-time
- Use time-travel debugging
- Inspect the DOM at any step

### One-Time Setup (macOS)

```bash
# Install XQuartz
brew install --cask xquartz

# Run the setup script (included in the project)
./setup-cypress-ui.sh

# Restart frontend container
docker-compose restart frontend
```

The setup script:
- Checks if XQuartz is installed
- Starts XQuartz if needed
- Configures X11 permissions
- Shows you next steps

### Open Cypress UI

```bash
docker exec reelporn_frontend bun run cypress:open
```

The Cypress Test Runner will open on your Mac! Click on `age-verification.cy.ts` to run tests interactively.

### Manual Setup (if script doesn't work)

```bash
# 1. Make sure XQuartz is running
open -a XQuartz

# 2. Allow Docker to connect
export IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
xhost + $IP

# 3. Restart container
docker-compose restart frontend

# 4. Open Cypress
docker exec reelporn_frontend bun run cypress:open
```

**Note:** You'll need to run the setup script again after restarting your Mac.

---

## Method 3: Headless (Fastest)

**Best for:** CI/CD, quick checks, when you don't need visuals

Runs all tests without any visual output - fastest execution.

```bash
# Run all tests headlessly (no video)
docker exec reelporn_frontend bun run cypress:run --config video=false

# Run specific test file
docker exec reelporn_frontend bun run cypress:run --spec "cypress/e2e/age-verification.cy.ts"

# Run in specific browser
docker exec reelporn_frontend bun run cypress:run:chrome
```

---

## Comparison Table

| Feature | Video Recording | Cypress UI | Headless |
|---------|----------------|------------|----------|
| **Setup** | None ✅ | XQuartz needed | None ✅ |
| **Watch Live** | ❌ | ✅ | ❌ |
| **Interactive** | ❌ | ✅ | ❌ |
| **Replayable** | ✅ | ❌ | ❌ |
| **Speed** | Medium | Slow | Fast ✅ |
| **Best For** | Daily dev | Debugging | CI/CD |

---

## All Available Commands

```bash
# Video recording (recommended for dev)
docker exec reelporn_frontend bun run test:e2e

# Cypress UI (requires XQuartz)
docker exec reelporn_frontend bun run cypress:open

# Headless (fast, no video)
docker exec reelporn_frontend bun run cypress:run --config video=false

# Headed mode (visible browser, requires XQuartz)
docker exec reelporn_frontend bun run test:e2e:headed

# Specific browser
docker exec reelporn_frontend bun run cypress:run:chrome
docker exec reelporn_frontend bun run cypress:run:firefox

# Specific test file
docker exec reelporn_frontend bun run cypress:run --spec "cypress/e2e/age-verification.cy.ts"
```

---

## Expected Test Output

When tests run successfully:

```
====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        15.5.0                                                                         │
  │ Browser:        Electron 118 (headless)                                                        │
  │ Specs:          1 found (age-verification.cy.ts)                                               │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

  Running:  age-verification.cy.ts                                                          (1 of 1)

  Age Verification Widget
    Modal Display
      ✓ should display age verification modal on first visit (1234ms)
      ✓ should hide page content when modal is displayed (567ms)
      ✓ should not display modal if already verified (890ms)
    Age Verification Actions
      ✓ should allow entry when clicking "Enter" button (18+) (456ms)
      ✓ should redirect to blocked page when clicking "Exit" button (under 18) (678ms)
      ✓ should persist age verification across page navigations (345ms)
      ✓ should persist blocked state across page navigations (234ms)
    Language Switching
      ✓ should display language selector with all supported languages (123ms)
      ✓ should switch language when selecting from dropdown (567ms)
      ✓ should maintain selected language after verification (345ms)
    ...

  60 passing (45s)

====================================================================================================

  (Run Finished)

  Videos:  cypress/videos/age-verification.cy.ts.mp4
```

---

## Test Coverage

The test suite includes **60+ tests** covering:

### Core Functionality
- ✅ Modal display on first visit
- ✅ Age verification (18+) → grants access
- ✅ Age restriction (under 18) → redirects to blocked page
- ✅ LocalStorage persistence across sessions
- ✅ Page content hiding during verification

### Multi-Language Support
- ✅ Language selector with 4 languages (en, nl, de, fr)
- ✅ Language switching updates URL
- ✅ Locale persists after verification
- ✅ Translated content validation

### User Experience
- ✅ Excluded pages (blocked, parental controls, error pages)
- ✅ Parental controls link navigation
- ✅ Copyright year displays correctly
- ✅ Keyboard navigation support
- ✅ Accessibility features

### Edge Cases
- ✅ Rapid button clicks
- ✅ Multiple language switches
- ✅ State transitions (blocked ↔ verified)
- ✅ Browser compatibility (localStorage disabled)

---

## Troubleshooting

### Container Not Running
```bash
docker-compose up -d frontend
```

### Dev Server Not Accessible
```bash
# Check if server is running
curl http://localhost:5173

# View logs
docker-compose logs frontend

# Restart dev server
docker exec reelporn_frontend bun run dev
```

### Cypress Binary Not Found
```bash
# Reinstall dependencies
docker exec reelporn_frontend bun install
```

### Tests Timing Out
```bash
# Make sure dev server is running
docker exec reelporn_frontend bun run dev

# Then run tests
docker exec reelporn_frontend bun run test:e2e
```

### X11 "Cannot Open Display" Error

```bash
# Make sure XQuartz is running
open -a XQuartz

# Run setup script
./setup-cypress-ui.sh

# Restart container
docker-compose restart frontend
```

### Videos Not Generated

Check `cypress.config.ts` - video should be `true`:
```typescript
video: true,
```

Or force video recording:
```bash
docker exec reelporn_frontend bun run cypress:run --config video=true
```

---

## CI/CD Integration

For GitHub Actions, GitLab CI, etc:

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: |
    docker-compose up -d frontend
    docker exec reelporn_frontend bun run cypress:run --config video=false
```

Use `video=false` in CI to save storage and speed up tests.

---

## File Locations

- **Test specs**: `cypress/e2e/age-verification.cy.ts`
- **Custom commands**: `cypress/support/commands.ts`
- **Configuration**: `cypress.config.ts`
- **Videos**: `cypress/videos/` (gitignored)
- **Screenshots**: `cypress/screenshots/` (gitignored)
- **Setup script**: `setup-cypress-ui.sh`

---

## More Information

- **Detailed Cypress docs**: See `cypress/README.md`
- **Visual setup guide**: See `CYPRESS_SETUP.md`
- **Component source**: `src/components/AgeVerification.tsx`
- **Cypress documentation**: https://docs.cypress.io/

---

## Recommended Workflow

1. **Daily development**: Use video recording
   ```bash
   docker exec reelporn_frontend bun run test:e2e
   open cypress/videos/age-verification.cy.ts.mp4
   ```

2. **Debugging failures**: Use Cypress UI
   ```bash
   ./setup-cypress-ui.sh  # First time only
   docker exec reelporn_frontend bun run cypress:open
   ```

3. **Quick checks**: Use headless mode
   ```bash
   docker exec reelporn_frontend bun run cypress:run --config video=false
   ```

4. **CI/CD pipelines**: Use headless without video
   ```bash
   docker exec reelporn_frontend bun run cypress:run --config video=false
   ```
