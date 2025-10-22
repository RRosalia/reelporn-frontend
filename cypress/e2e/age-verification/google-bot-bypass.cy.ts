/// <reference types="cypress" />

/**
 * Googlebot Age Verification Bypass Tests
 *
 * Verifies that Googlebot can bypass the age verification modal
 * to ensure proper indexing for SEO purposes.
 */

describe('Googlebot Age Verification Bypass', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearAgeVerification();
    cy.clearCookies();

    // Mock crawler API to return success for Googlebot
    cy.mockCrawlerAPI(true);
  });

  it('should set crawler-bypass cookie for Googlebot user agent', () => {
    // Visit with Googlebot user agent
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    // Check that crawler-bypass cookie is set
    cy.getCookie('crawler-bypass').should('exist');
    cy.getCookie('crawler-bypass').should('have.property', 'value', 'true');
  });

  it('should not display age verification modal for Googlebot', () => {
    // Visit with Googlebot user agent
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    // Wait to ensure modal doesn't appear
    cy.wait(1000);

    // Modal should not exist
    cy.get('.age-verification-overlay').should('not.exist');
    cy.get('.age-verification-modal').should('not.exist');

    // Page content should be visible (no age-verification-pending class)
    cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
  });

  it('should not require age verification for Googlebot on any page', () => {
    const pages = ['/', '/pornstars', '/categories'];

    pages.forEach((page) => {
      cy.visit(page, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Wait to ensure modal doesn't appear
      cy.wait(500);

      // Modal should not exist
      cy.get('.age-verification-overlay').should('not.exist');
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });
  });

  it('should allow Googlebot to access content immediately without localStorage', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    // Check that no age verification flags are in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('ageVerified')).to.be.null;
      expect(win.localStorage.getItem('ageBlocked')).to.be.null;
    });

    // But page should still be accessible
    cy.get('.age-verification-overlay').should('not.exist');
  });

  it('should handle case-insensitive bot detection', () => {
    // Test with uppercase GOOGLEBOT
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; GOOGLEBOT/2.1; +http://www.google.com/bot.html)'
      }
    });

    cy.wait(1000);
    cy.get('.age-verification-overlay').should('not.exist');
  });

  it('should allow Googlebot on locale-specific pages', () => {
    const locales = ['/', '/nl', '/de', '/fr'];

    locales.forEach((locale) => {
      cy.visit(locale, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      cy.wait(500);
      cy.get('.age-verification-overlay').should('not.exist');
    });
  });

  it('should ensure crawler-bypass cookie has appropriate settings', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    cy.getCookie('crawler-bypass').should('exist').then((cookie) => {
      expect(cookie.value).to.equal('true');
      expect(cookie.sameSite).to.equal('lax');
      // Cookie should have a maxAge (expiry)
      expect(cookie).to.have.property('expiry');
    });
  });

  it('should maintain crawler-bypass cookie across navigation', () => {
    cy.visit('/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    cy.getCookie('crawler-bypass').should('exist');

    // Navigate to another page
    cy.visit('/pornstars', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    // Cookie should still exist
    cy.getCookie('crawler-bypass').should('exist');
    cy.get('.age-verification-overlay').should('not.exist');
  });
});
