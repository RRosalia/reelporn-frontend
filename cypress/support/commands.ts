/// <reference types="cypress" />

// Custom commands for Age Verification testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to clear age verification localStorage items
       * @example cy.clearAgeVerification()
       */
      clearAgeVerification(): Chainable<void>;

      /**
       * Custom command to set age as verified in localStorage
       * @example cy.setAgeVerified()
       */
      setAgeVerified(): Chainable<void>;

      /**
       * Custom command to set age as blocked in localStorage
       * @example cy.setAgeBlocked()
       */
      setAgeBlocked(): Chainable<void>;

      /**
       * Custom command to wait for age verification modal to appear
       * @example cy.waitForAgeModal()
       */
      waitForAgeModal(): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if page is hidden by age verification
       * @example cy.checkPageHidden()
       */
      checkPageHidden(): Chainable<void>;

      /**
       * Custom command to mock the crawler verification API
       * @param isCrawler - Whether to return a crawler (200) or not (403) response
       * @example cy.mockCrawlerAPI(true)
       */
      mockCrawlerAPI(isCrawler: boolean): Chainable<void>;
    }
  }
}

// Clear age verification from localStorage
Cypress.Commands.add('clearAgeVerification', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('ageVerified');
    win.localStorage.removeItem('ageBlocked');
  });
});

// Set age as verified
Cypress.Commands.add('setAgeVerified', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('ageVerified', 'true');
    win.localStorage.removeItem('ageBlocked');
  });
});

// Set age as blocked
Cypress.Commands.add('setAgeBlocked', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('ageBlocked', 'true');
    win.localStorage.removeItem('ageVerified');
  });
});

// Wait for age verification modal to appear
Cypress.Commands.add('waitForAgeModal', () => {
  return cy.get('.age-verification-overlay', { timeout: 10000 }).should('be.visible');
});

// Check if page content is hidden (class on html element)
Cypress.Commands.add('checkPageHidden', () => {
  cy.document().its('documentElement').should('have.class', 'age-verification-pending');
});

// Mock the crawler verification API
Cypress.Commands.add('mockCrawlerAPI', (isCrawler: boolean) => {
  // Set test header to control crawler detection in middleware
  // This works because middleware checks x-test-crawler header before calling backend
  cy.intercept('**/*', (req) => {
    req.headers['x-test-crawler'] = isCrawler ? 'true' : 'false';
    req.continue();
  }).as('testCrawlerHeader');
});

export {};
