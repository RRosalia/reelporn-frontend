/// <reference types="cypress" />

/**
 * Bingbot Age Verification Bypass Tests
 *
 * Verifies that Bingbot can bypass the age verification modal
 * to ensure proper indexing for SEO purposes.
 */

describe('Bingbot Age Verification Bypass', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearAgeVerification();
    cy.clearCookies();

    // Mock crawler API to return success for Bingbot
    cy.mockCrawlerAPI(true);
  });

  it('should set crawler-bypass cookie for Bingbot user agent', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      }
    });

    cy.getCookie('crawler-bypass').should('exist');
    cy.getCookie('crawler-bypass').should('have.property', 'value', 'true');
  });

  it('should not display age verification modal for Bingbot', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      }
    });

    cy.wait(1000);
    cy.get('.age-verification-overlay').should('not.exist');
    cy.get('.age-verification-modal').should('not.exist');
    cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
  });

  it('should allow Bingbot to access multiple pages', () => {
    const pages = ['/', '/pornstars', '/categories'];

    pages.forEach((page) => {
      cy.visit(page, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        }
      });

      cy.wait(500);
      cy.get('.age-verification-overlay').should('not.exist');
    });
  });

  it('should allow Bingbot on locale-specific pages', () => {
    const locales = ['/', '/nl', '/de', '/fr'];

    locales.forEach((locale) => {
      cy.visit(locale, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        }
      });

      cy.wait(500);
      cy.get('.age-verification-overlay').should('not.exist');
    });
  });

  it('should maintain crawler-bypass cookie across navigation', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      }
    });

    cy.getCookie('crawler-bypass').should('exist');

    cy.visit('/pornstars', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      }
    });

    cy.getCookie('crawler-bypass').should('exist');
    cy.get('.age-verification-overlay').should('not.exist');
  });
});
