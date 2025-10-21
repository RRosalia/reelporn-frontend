# Cypress E2E Testing for Age Verification

This directory contains end-to-end (E2E) tests for the Age Verification widget using Cypress.

## Test Coverage

The age verification E2E tests cover the following scenarios:

### Core Functionality
- **Modal Display**: First-time visitor sees the age verification modal
- **Age Verification**: Clicking "Enter" (18+) grants access and stores verification in localStorage
- **Age Restriction**: Clicking "Exit" (under 18) redirects to blocked page and stores blocked state
- **Persistence**: Verification status persists across page navigations
- **Content Hiding**: Page content is hidden while modal is displayed

### Language Support
- Language selector displays all 4 supported languages (English, Nederlands, Deutsch, Français)
- Language switching updates URL and preserves modal state
- Locale is maintained after verification

### Excluded Pages
- Modal does not appear on `/blocked` page
- Modal does not appear on `/parental-controls` page
- Modal does not appear on error pages

### User Experience
- Parental controls link navigates correctly with proper locale
- Copyright year displays current year
- Keyboard navigation works correctly
- Rapid button clicks are handled gracefully
- Switching between blocked and verified states works correctly

### Edge Cases
- LocalStorage persistence across sessions
- Clearing verification and revisiting
- Multiple language switches
- Browser compatibility (localStorage disabled)

## Running Tests

### Prerequisites

1. **Docker**: All tests must be run through the Docker container
2. **Cypress Dependencies**: The Docker image includes all required Cypress dependencies (Xvfb, GTK, etc.)
3. **Dev Server**: The Next.js dev server must be running on port 5173 (mapped from container port 3000)

### First Time Setup

After adding Cypress, you need to rebuild the Docker container to install Cypress dependencies:

```bash
# Stop the frontend container
docker-compose stop frontend

# Rebuild the frontend container with Cypress dependencies
docker-compose build frontend

# Start the container again
docker-compose up -d frontend
```

### Start the Development Server

```bash
# Start the frontend dev server (must be running for tests to work)
docker exec reelporn_frontend bun run dev
```

The server will be accessible at `http://localhost:5173`

### Running Tests

#### Run All Tests (Headless Mode) - **RECOMMENDED**

```bash
# Run all E2E tests headlessly (works in any Docker environment)
docker exec reelporn_frontend bun run cypress:run

# Or use the test:e2e alias
docker exec reelporn_frontend bun run test:e2e
```

**This is the recommended approach for running tests in Docker** as it doesn't require a display server.

#### Open Cypress UI (Interactive Mode) - **Advanced**

```bash
# This requires X11 forwarding or display access
docker exec reelporn_frontend bun run cypress:open
```

⚠️ **Note**: The interactive UI mode requires additional setup for Docker:
- Linux: May need X11 forwarding configured
- macOS: Requires XQuartz and DISPLAY environment variable
- Windows: Requires X server (like VcXsrv)

**For most use cases, use headless mode (`cypress:run`) instead.**

#### Run Tests in Specific Browser

```bash
# Run in Chrome
docker exec reelporn_frontend bun run cypress:run:chrome

# Run in Firefox
docker exec reelporn_frontend bun run cypress:run:firefox

# Run with headed mode (see browser window)
docker exec reelporn_frontend bun run test:e2e:headed
```

#### Run Specific Test File

```bash
# Run only the age verification tests
docker exec reelporn_frontend bun run cypress:run --spec "cypress/e2e/age-verification.cy.ts"
```

## Test Structure

```
cypress/
├── e2e/
│   └── age-verification.cy.ts    # Age verification E2E tests
├── support/
│   ├── commands.ts                # Custom Cypress commands
│   ├── e2e.ts                     # E2E test configuration
│   └── component.ts               # Component test configuration
└── README.md                      # This file
```

## Custom Commands

The following custom commands are available for age verification testing:

### `cy.clearAgeVerification()`
Clears age verification data from localStorage.

```typescript
cy.clearAgeVerification();
```

### `cy.setAgeVerified()`
Sets the user as age-verified in localStorage.

```typescript
cy.setAgeVerified();
cy.visit('/');
// Modal will not appear
```

### `cy.setAgeBlocked()`
Sets the user as age-blocked in localStorage.

```typescript
cy.setAgeBlocked();
cy.visit('/');
// Will redirect to /blocked
```

### `cy.waitForAgeModal()`
Waits for the age verification modal to appear and be visible.

```typescript
cy.visit('/');
cy.waitForAgeModal();
// Modal is now visible and ready for interaction
```

### `cy.checkPageHidden()`
Checks if the page content is hidden (age-verification-pending class on HTML element).

```typescript
cy.visit('/');
cy.waitForAgeModal();
cy.checkPageHidden();
// Confirms page content is hidden
```

## Writing New Tests

When adding new age verification tests:

1. Always use `cy.clearAgeVerification()` in `beforeEach()` to ensure clean state
2. Use the custom commands for common operations
3. Test both happy path and edge cases
4. Verify localStorage state after actions
5. Check URL redirects where applicable
6. Test across multiple locales

### Example Test

```typescript
it('should verify age and persist across pages', () => {
  cy.visit('/');
  cy.waitForAgeModal();

  // Verify age
  cy.get('.age-btn-enter').click();

  // Check localStorage
  cy.window().its('localStorage.ageVerified').should('equal', 'true');

  // Navigate to another page
  cy.visit('/pornstars');

  // Modal should not appear
  cy.get('.age-verification-overlay').should('not.exist');
});
```

## Troubleshooting

### Tests Fail with "baseUrl" Error
- Ensure the dev server is running: `docker exec reelporn_frontend bun run dev`
- Verify the server is accessible at `http://localhost:5173`

### Modal Doesn't Appear in Tests
- Check that localStorage is cleared: `cy.clearAgeVerification()`
- Verify you're not on an excluded page (`/blocked`, `/parental-controls`, `/error-codes/*`)

### Language Tests Fail
- Ensure all translation files exist in `src/i18n/locales/`
- Check that routing is configured correctly in `src/i18n/routing.ts`

### Timeout Errors
- Increase timeout in `cy.waitForAgeModal()` if needed
- Check that the modal rendering isn't blocked by other components

## CI/CD Integration

To run tests in CI/CD pipelines:

```bash
# In your CI/CD pipeline
docker exec reelporn_frontend bun run test:e2e
```

Tests will exit with code 0 on success, non-zero on failure.

## Related Files

- **Component**: `src/components/AgeVerification.tsx`
- **Styles**: `src/components/AgeVerification.css`
- **Translations**: `src/i18n/locales/*.json` (look for "age" keys)
- **Config**: `cypress.config.ts`

## Best Practices

1. **Always run through Docker**: Never run Cypress commands directly on host
2. **Clean state**: Use `beforeEach()` to reset localStorage
3. **Descriptive tests**: Use clear, descriptive test names
4. **Isolation**: Each test should be independent
5. **Wait properly**: Use `cy.wait()` only when necessary, prefer `should()` assertions
6. **Custom commands**: Leverage custom commands to keep tests DRY

## Support

For issues or questions about the tests:
1. Check the Cypress documentation: https://docs.cypress.io/
2. Review the component implementation in `src/components/AgeVerification.tsx`
3. Check the project's main README for general setup instructions
