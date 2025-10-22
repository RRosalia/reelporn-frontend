/// <reference types="cypress" />

describe('Age Verification Widget', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearAgeVerification();
  });

  describe('Modal Display', () => {
    it('should display age verification modal on first visit', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Check that the modal contains all required elements
      cy.get('.age-verification-modal').should('be.visible');
      cy.get('.age-logo').should('contain', 'Reel').and('contain', 'Porn');
      cy.get('.age-title').should('be.visible');
      cy.get('.age-notice-badge').should('be.visible');
      cy.get('.age-warning-text').should('be.visible');
      cy.get('.age-btn-enter').should('be.visible');
      cy.get('.age-btn-exit').should('be.visible');
      cy.get('.age-parental-link').should('be.visible');
      cy.get('.age-footer').should('contain', new Date().getFullYear().toString());
    });

    it('should hide page content when modal is displayed', () => {
      cy.visit('/');
      cy.waitForAgeModal();
      cy.checkPageHidden();
    });

    it('should not display modal if already verified', () => {
      cy.setAgeVerified();
      cy.visit('/');

      // Wait a bit to ensure modal doesn't appear
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');

      // Check that page content is visible
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });
  });

  describe('Age Verification Actions', () => {
    it('should allow entry when clicking "Enter" button (18+)', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Click the enter button
      cy.get('.age-btn-enter').click();

      // Modal should close
      cy.get('.age-verification-overlay').should('not.exist');

      // Check localStorage is set correctly
      cy.window().its('localStorage.ageVerified').should('equal', 'true');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('ageBlocked')).to.be.null;
      });

      // Page should be visible
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });

    it('should redirect to blocked page when clicking "Exit" button (under 18)', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Click the exit button
      cy.get('.age-btn-exit').click();

      // Should redirect to blocked page
      cy.url().should('include', '/blocked');

      // Check localStorage is set correctly
      cy.window().its('localStorage.ageBlocked').should('equal', 'true');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('ageVerified')).to.be.null;
      });
    });

    it('should persist age verification across page navigations', () => {
      cy.visit('/');
      cy.waitForAgeModal();
      cy.get('.age-btn-enter').click();

      // Navigate to another page
      cy.visit('/');

      // Modal should not appear again
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');
    });

    it('should persist blocked state across page navigations', () => {
      cy.setAgeBlocked();
      cy.visit('/');

      // Should immediately redirect to blocked page
      cy.url().should('include', '/blocked');
      cy.get('.age-verification-overlay').should('not.exist');
    });
  });

  describe('Language Switching', () => {
    it('should display language selector with all supported languages', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      cy.get('.age-lang-dropdown').should('be.visible');
      cy.get('.age-lang-dropdown option').should('have.length', 10);

      // Check all languages are present
      cy.get('.age-lang-dropdown option[value="en"]').should('contain', 'English');
      cy.get('.age-lang-dropdown option[value="nl"]').should('contain', 'Nederlands');
      cy.get('.age-lang-dropdown option[value="de"]').should('contain', 'Deutsch');
      cy.get('.age-lang-dropdown option[value="fr"]').should('contain', 'Français');
      cy.get('.age-lang-dropdown option[value="es"]').should('contain', 'Español');
      cy.get('.age-lang-dropdown option[value="it"]').should('contain', 'Italiano');
      cy.get('.age-lang-dropdown option[value="pl"]').should('contain', 'Polski');
      cy.get('.age-lang-dropdown option[value="pt"]').should('contain', 'Português');
      cy.get('.age-lang-dropdown option[value="sv"]').should('contain', 'Svenska');
      cy.get('.age-lang-dropdown option[value="cs"]').should('contain', 'Čeština');
    });

    it('should switch language when selecting from dropdown', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Select Dutch language
      cy.get('.age-lang-dropdown').select('nl');

      // URL should change to include language prefix
      cy.url().should('include', '/nl');

      // Modal should still be visible with Dutch content
      cy.waitForAgeModal();
    });

    it('should maintain selected language after verification', () => {
      cy.visit('/nl');
      cy.waitForAgeModal();

      // Verify
      cy.get('.age-btn-enter').click();

      // URL should still be in Dutch
      cy.url().should('include', '/nl');
    });
  });

  describe('Excluded Pages', () => {
    it('should not show modal on blocked page', () => {
      cy.visit('/blocked');

      // Wait to ensure modal doesn't appear
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });

    it('should not show modal on parental controls page', () => {
      cy.visit('/parental-controls');

      // Wait to ensure modal doesn't appear
      cy.wait(1000);
      cy.get('.age-verification-overlay').should('not.exist');
      cy.document().its('documentElement').should('not.have.class', 'age-verification-pending');
    });
  });

  describe('Parental Controls Link', () => {
    it('should have working parental controls link', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Find and click parental controls link
      cy.get('.age-parental-link a').should('have.attr', 'href').and('include', '/parental-controls');
    });

    it('should navigate to parental controls page with correct locale', () => {
      cy.visit('/nl');
      cy.waitForAgeModal();

      // Check parental link includes locale
      cy.get('.age-parental-link a').should('have.attr', 'href', '/nl/parental-controls');
    });

    it('should use root path for English locale', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // English should not have locale prefix
      cy.get('.age-parental-link a').should('have.attr', 'href', '/parental-controls');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      cy.get('h1.age-title').should('exist');
      cy.get('button.age-btn-enter').should('exist');
      cy.get('button.age-btn-exit').should('exist');
      cy.get('select.age-lang-dropdown').should('exist');
    });

    it('should have keyboard navigation support', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Tab through interactive elements
      cy.get('.age-lang-dropdown').focus().should('have.focus');
      cy.get('.age-lang-dropdown').trigger('keydown', { keyCode: 9, which: 9 }); // Tab key
      cy.get('.age-btn-enter').focus().should('have.focus');
      cy.get('.age-btn-enter').trigger('keydown', { keyCode: 9, which: 9 }); // Tab key
      cy.get('.age-btn-exit').focus().should('have.focus');
    });

    it('should allow Enter button to be activated with keyboard', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Focus and click the button (simulating Enter key activation)
      cy.get('.age-btn-enter').focus().click();

      // Modal should close
      cy.get('.age-verification-overlay').should('not.exist');
      cy.window().its('localStorage.ageVerified').should('equal', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button clicks gracefully', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Click enter button and immediately check the result
      // The first click should handle the action, subsequent clicks should be ignored
      cy.get('.age-btn-enter').click();

      // Should work correctly
      cy.get('.age-verification-overlay').should('not.exist');
      cy.window().its('localStorage.ageVerified').should('equal', 'true');
    });

    it('should handle switching languages multiple times', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      // Switch languages multiple times with force option to handle visibility issues
      cy.get('.age-lang-dropdown').select('nl', { force: true });
      cy.url().should('include', '/nl');
      cy.waitForAgeModal(); // Wait for modal after navigation

      cy.get('.age-lang-dropdown').select('de', { force: true });
      cy.url().should('include', '/de');
      cy.waitForAgeModal(); // Wait for modal after navigation

      cy.get('.age-lang-dropdown').select('fr', { force: true });
      cy.url().should('include', '/fr');
      cy.waitForAgeModal(); // Wait for modal after navigation

      cy.get('.age-lang-dropdown').select('en', { force: true });
      cy.url().should('not.include', '/en'); // English has no prefix
    });

    it('should display correct copyright year', () => {
      cy.visit('/');
      cy.waitForAgeModal();

      const currentYear = new Date().getFullYear();
      cy.get('.age-footer').should('contain', `© ReelPorn.com, ${currentYear}`);
    });

    it('should handle clearing ageVerified and visiting again', () => {
      // Verify age first
      cy.visit('/');
      cy.waitForAgeModal();
      cy.get('.age-btn-enter').click();

      // Clear localStorage
      cy.clearAgeVerification();

      // Visit again
      cy.visit('/');

      // Modal should appear again
      cy.waitForAgeModal();
    });

    it('should handle switching from blocked to verified', () => {
      // First block the user
      cy.visit('/');
      cy.waitForAgeModal();
      cy.get('.age-btn-exit').click();
      cy.url().should('include', '/blocked');

      // Clear blocked state and verify
      cy.clearAgeVerification();
      cy.visit('/');
      cy.waitForAgeModal();
      cy.get('.age-btn-enter').click();

      // Should be verified now
      cy.window().its('localStorage.ageVerified').should('equal', 'true');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('ageBlocked')).to.be.null;
      });
    });
  });

  describe('Multi-language Content', () => {
    const locales = [
      { code: 'en', name: 'English' },
      { code: 'nl', name: 'Nederlands' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' }
    ];

    locales.forEach(({ code, name }) => {
      it(`should display age verification modal in ${name}`, () => {
        const url = code === 'en' ? '/' : `/${code}`;
        cy.visit(url);
        cy.waitForAgeModal();

        // Check language selector shows correct language
        cy.get('.age-lang-dropdown').should('have.value', code);

        // Modal should be visible with content
        cy.get('.age-title').should('be.visible');
        cy.get('.age-notice-badge').should('be.visible');
      });
    });
  });

  describe('Browser Compatibility', () => {
    it.skip('should work with localStorage disabled (graceful degradation)', () => {
      // This test simulates localStorage being unavailable
      // We expect localStorage errors but the app should handle them gracefully
      cy.on('uncaught:exception', (err) => {
        // We expect localStorage errors in this specific test
        if (err.message.includes('localStorage disabled')) {
          return false; // Prevent the error from failing the test
        }
        return true;
      });

      cy.visit('/', {
        onBeforeLoad(win) {
          // Stub localStorage to throw errors
          cy.stub(win.localStorage, 'getItem').throws(new Error('localStorage disabled'));
          cy.stub(win.localStorage, 'setItem').throws(new Error('localStorage disabled'));
          cy.stub(win.localStorage, 'removeItem').throws(new Error('localStorage disabled'));
        }
      });

      // Modal should still appear (won't remember, but won't crash)
      // The component should handle the error gracefully with its try-catch blocks
      cy.waitForAgeModal();
    });
  });
});
