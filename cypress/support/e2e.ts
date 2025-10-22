// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent Cypress from failing tests on uncaught exceptions
// This is useful for Next.js applications
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can add specific error messages to ignore if needed
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});

// Set default viewport for consistent testing
beforeEach(() => {
  cy.viewport(1280, 720);
});
