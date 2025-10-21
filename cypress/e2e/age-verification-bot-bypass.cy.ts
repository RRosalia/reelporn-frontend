/// <reference types="cypress" />

/**
 * Age Verification Bot Bypass Tests
 *
 * These tests verify that legitimate crawlers (Google, Bing, etc.) can bypass
 * the age verification modal to ensure proper indexing for SEO purposes.
 */

describe('Age Verification - Bot Bypass', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearAgeVerification();
    cy.clearCookies();
  });

  describe('Googlebot Bypass', () => {
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
  });

  describe('Other Search Engine Bots', () => {
    const crawlers = [
      {
        name: 'Bingbot',
        userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      },
      {
        name: 'DuckDuckBot',
        userAgent: 'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)'
      },
      {
        name: 'Baiduspider',
        userAgent: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)'
      },
      {
        name: 'YandexBot',
        userAgent: 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
      }
    ];

    crawlers.forEach(({ name, userAgent }) => {
      it(`should bypass age verification for ${name}`, () => {
        cy.visit('/', {
          headers: {
            'user-agent': userAgent
          }
        });

        // Wait to ensure modal doesn't appear
        cy.wait(1000);

        // Modal should not exist
        cy.get('.age-verification-overlay').should('not.exist');
        cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');

        // Crawler-bypass cookie should be set
        cy.getCookie('crawler-bypass').should('exist');
      });
    });
  });

  describe('Social Media Crawlers', () => {
    const socialCrawlers = [
      {
        name: 'FacebookExternalHit',
        userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      },
      {
        name: 'TwitterBot',
        userAgent: 'Twitterbot/1.0'
      },
      {
        name: 'LinkedInBot',
        userAgent: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)'
      },
      {
        name: 'WhatsApp',
        userAgent: 'WhatsApp/2.19.175 A'
      }
    ];

    socialCrawlers.forEach(({ name, userAgent }) => {
      it(`should bypass age verification for ${name}`, () => {
        cy.visit('/', {
          headers: {
            'user-agent': userAgent
          }
        });

        // Wait to ensure modal doesn't appear
        cy.wait(1000);

        // Modal should not exist
        cy.get('.age-verification-overlay').should('not.exist');
        cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');

        // Crawler-bypass cookie should be set
        cy.getCookie('crawler-bypass').should('exist');
      });
    });
  });

  describe('Regular Users', () => {
    it('should display age verification modal for regular Chrome browser', () => {
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      // Wait for modal to appear
      cy.waitForAgeModal();

      // Modal should be visible
      cy.get('.age-verification-modal').should('be.visible');

      // Crawler-bypass cookie should NOT be set
      cy.getCookie('crawler-bypass').should('not.exist');
    });

    it('should display age verification modal for regular Firefox browser', () => {
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
        }
      });

      // Wait for modal to appear
      cy.waitForAgeModal();

      // Modal should be visible
      cy.get('.age-verification-modal').should('be.visible');

      // Crawler-bypass cookie should NOT be set
      cy.getCookie('crawler-bypass').should('not.exist');
    });

    it('should display age verification modal for regular Safari browser', () => {
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
        }
      });

      // Wait for modal to appear
      cy.waitForAgeModal();

      // Modal should be visible
      cy.get('.age-verification-modal').should('be.visible');

      // Crawler-bypass cookie should NOT be set
      cy.getCookie('crawler-bypass').should('not.exist');
    });
  });

  describe('Bot Detection Edge Cases', () => {
    it('should not bypass for user agent with "googlebot" in name but not legitimate', () => {
      // This tests a fake/spoofed user agent
      cy.visit('/', {
        headers: {
          'user-agent': 'MyCustomBrowser/1.0 (googlebot in name but fake)'
        }
      });

      // Modal should appear because IP verification would fail
      // Note: In real scenario, the middleware checks IP with backend
      // In Cypress, we're testing the frontend behavior
      cy.waitForAgeModal();
      cy.get('.age-verification-modal').should('be.visible');
    });

    it('should handle case-insensitive bot detection', () => {
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; GOOGLEBOT/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Wait to ensure modal doesn't appear
      cy.wait(1000);

      // Should still bypass (case-insensitive check)
      cy.get('.age-verification-overlay').should('not.exist');
    });

    it('should not break when crawler-bypass cookie is manually set', () => {
      // Manually set the cookie (simulating a persistent cookie)
      cy.setCookie('crawler-bypass', 'true');

      cy.visit('/');

      // Modal should not appear
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });
  });

  describe('SEO and Indexing Compliance', () => {
    it('should allow Googlebot to access all public pages without age verification', () => {
      const publicPages = [
        '/',
        '/categories',
        '/pornstars',
        '/parental-controls'
      ];

      publicPages.forEach((page) => {
        cy.visit(page, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        });

        // Modal should never appear
        cy.wait(500);
        cy.get('.age-verification-overlay').should('not.exist');

        // Verify page is accessible
        cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
      });
    });

    it('should not interfere with locale-specific pages for Googlebot', () => {
      const locales = ['nl', 'de', 'fr'];

      locales.forEach((locale) => {
        cy.visit(`/${locale}`, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        });

        // Modal should not appear
        cy.wait(500);
        cy.get('.age-verification-overlay').should('not.exist');

        // URL should contain locale
        cy.url().should('include', `/${locale}`);
      });
    });

    it('should ensure crawler-bypass cookie has appropriate settings', () => {
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Check cookie properties
      cy.getCookie('crawler-bypass').should((cookie) => {
        expect(cookie).to.exist;
        expect(cookie?.value).to.equal('true');
        // httpOnly cookies are not accessible from Cypress client side,
        // but we can verify the cookie exists
      });
    });
  });

  describe('Mixed Scenarios', () => {
    it('should allow bot to access content even if user previously set ageBlocked', () => {
      // Set blocked state as regular user
      cy.setAgeBlocked();

      // Now visit as Googlebot
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Should NOT redirect to blocked page
      cy.url().should('not.include', '/blocked');

      // Modal should not appear
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');
    });

    it('should prioritize crawler-bypass over localStorage ageVerified flag', () => {
      // Don't set ageVerified (simulate first visit)

      // Visit as Googlebot
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Modal should not appear even without ageVerified
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');

      // localStorage should still be empty
      cy.window().then((win) => {
        expect(win.localStorage.getItem('ageVerified')).to.be.null;
        expect(win.localStorage.getItem('ageBlocked')).to.be.null;
      });
    });
  });

  describe('Performance and Caching', () => {
    it('should handle rapid successive bot requests efficiently', () => {
      // Visit multiple times as Googlebot
      for (let i = 0; i < 3; i++) {
        cy.visit('/', {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        });

        cy.wait(500);
        cy.get('.age-verification-overlay').should('not.exist');
      }
    });

    it('should maintain crawler-bypass cookie across navigation', () => {
      // First visit as Googlebot
      cy.visit('/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      cy.getCookie('crawler-bypass').should('exist');

      // Navigate to another page (still as Googlebot)
      cy.visit('/pornstars', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      // Cookie should persist
      cy.getCookie('crawler-bypass').should('exist');
      cy.get('.age-verification-overlay').should('not.exist');
    });
  });
});
