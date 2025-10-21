# Cypress Visual Testing Setup

You have **three options** to see what's happening during tests:

## Option 1: Video Recording (Easiest - No Setup Required!)

Videos are now **enabled by default**. Just run your tests and watch the recordings afterward:

```bash
# Run tests (videos will be automatically recorded)
docker exec reelporn_frontend bun run test:e2e

# Videos are saved to: cypress/videos/
# Open them on your Mac to watch what happened
open cypress/videos/age-verification.cy.ts.mp4
```

**Benefits:**
- ✅ No setup required
- ✅ Works in any environment
- ✅ Can review tests multiple times
- ✅ Can share videos with team

**Location:** Videos saved to `cypress/videos/` directory

---

## Option 2: X11 Forwarding (Interactive UI on Mac)

This lets you open the full Cypress UI and watch tests in real-time.

### Step 1: Install XQuartz on macOS

```bash
brew install --cask xquartz
```

### Step 2: Configure XQuartz

1. Open XQuartz (it will be in your Applications folder)
2. Go to **XQuartz** → **Preferences** → **Security**
3. Check ✅ "Allow connections from network clients"
4. Restart XQuartz

### Step 3: Allow Docker to Connect

```bash
# Get your IP address
export IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')

# Allow Docker to connect to your display
xhost + $IP
```

### Step 4: Update docker-compose.yml

Add these environment variables to your frontend service:

```yaml
frontend:
  environment:
    - DISPLAY=host.docker.internal:0
    - NEXT_PUBLIC_API_URL=http://localhost:9000
    # ... other env vars
```

### Step 5: Restart Frontend Container

```bash
docker-compose stop frontend
docker-compose up -d frontend
```

### Step 6: Open Cypress UI

```bash
docker exec reelporn_frontend bun run cypress:open
```

The Cypress Test Runner will open on your Mac! Click on `age-verification.cy.ts` to run tests.

**Benefits:**
- ✅ Interactive test selection
- ✅ Real-time watching
- ✅ Time-travel debugging
- ✅ Can pause and inspect

**Drawbacks:**
- ❌ Requires XQuartz setup
- ❌ Need to run xhost command each time you restart

---

## Option 3: Headed Mode with X11 (Auto-Run with Visible Browser)

This automatically runs all tests but shows the browser window:

### Prerequisites
Complete Option 2 setup first (XQuartz + docker-compose changes)

### Run Tests

```bash
docker exec reelporn_frontend bun run test:e2e:headed
```

This runs all tests automatically but you can watch the browser in real-time.

**Benefits:**
- ✅ See tests run in real-time
- ✅ Automatic test execution
- ✅ No manual clicking

---

## Comparison Table

| Feature | Video Recording | Cypress UI | Headed Mode |
|---------|----------------|------------|-------------|
| Setup Required | None | XQuartz | XQuartz |
| Watch Live | ❌ | ✅ | ✅ |
| Interactive | ❌ | ✅ | ❌ |
| Replayable | ✅ | ❌ | ❌ |
| Best For | Daily testing | Debugging | Quick checks |

---

## Recommended Workflow

1. **Daily Development**: Use video recording
   ```bash
   docker exec reelporn_frontend bun run test:e2e
   open cypress/videos/age-verification.cy.ts.mp4
   ```

2. **Debugging Failures**: Use Cypress UI (if X11 is set up)
   ```bash
   docker exec reelporn_frontend bun run cypress:open
   ```

3. **CI/CD**: Use headless mode (no video to save resources)
   ```bash
   docker exec reelporn_frontend bun run cypress:run --config video=false
   ```

---

## Troubleshooting X11 Setup

### "Cannot open display" Error

Make sure XQuartz is running:
```bash
# Check if XQuartz is running
ps aux | grep XQuartz

# If not, open it manually
open -a XQuartz
```

Then run xhost again:
```bash
export IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
xhost + $IP
```

### X11 Connection Refused

Restart XQuartz and try again:
```bash
killall XQuartz
open -a XQuartz
sleep 2
export IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
xhost + $IP
```

### Docker Can't Connect

Make sure the DISPLAY environment variable is set in docker-compose.yml:
```yaml
environment:
  - DISPLAY=host.docker.internal:0
```

Then restart:
```bash
docker-compose restart frontend
```

---

## Quick Commands Reference

```bash
# Video recording (default)
docker exec reelporn_frontend bun run test:e2e

# Open videos
open cypress/videos/

# Cypress UI (requires X11)
docker exec reelporn_frontend bun run cypress:open

# Headed mode (requires X11)
docker exec reelporn_frontend bun run test:e2e:headed

# Headless (no video)
docker exec reelporn_frontend bun run cypress:run --config video=false

# Run specific test
docker exec reelporn_frontend bun run cypress:run --spec "cypress/e2e/age-verification.cy.ts"
```

---

## Video Settings

Videos are configured in `cypress.config.ts`:

```typescript
video: true,                    // Enable/disable videos
videoCompression: 32,           // Compression quality (0-51, lower = better)
videosFolder: 'cypress/videos', // Where to save videos
```

To disable videos globally, edit `cypress.config.ts`:
```typescript
video: false,
```

Or disable per run:
```bash
docker exec reelporn_frontend bun run cypress:run --config video=false
```
