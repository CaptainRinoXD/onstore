// cypress/integration/sidebar_spec.js
describe('Admin Sidebar Navigation Tests', () => {
  beforeEach(() => {
    // First, set the cookie to authenticate as an Admin
    cy.setCookie('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTg2MzIzMDhlMjA4YWJmYjFjYjgxNCIsImlhdCI6MTc0MTkzOTQ4NiwiZXhwIjoxNzQyNTQ0Mjg2fQ.8fLQiROhHK6E3lwqicfF_5xEt9lzGfuFa7r_Lgvqr30');
    cy.visit('/'); // Adjust the URL if necessary
    cy.get('#userModal', { timeout: 5000 }).click(); // Open user modal
    cy.get('#Dashboard', { timeout: 10000 }).click(); // Click on Dashboard to access admin sidebar
  });

  it('should navigate to Manage Product page', () => {
    // Click the "Manage Product" link
    cy.contains('Manage Product', { timeout: 10000 }).click();
    
    // Check that the URL contains the '/dashboard/product' path
    cy.url().should('include', '/dashboard/product');
  });

  it('should navigate to Manage Product Type page', () => {
    // Click the "Manage Product Type" link
    cy.contains('Manage Product Type', { timeout: 10000 }).click();
    
    // Check that the URL contains the '/dashboard/productType' path
    cy.url().should('include', '/dashboard/productType');
  });
  
  it('should navigate to Manage Collection page', () => {
    // Click the "Manage Collection" link
    cy.contains('Manage Collection', { timeout: 10000 }).click();
    
    // Check that the URL contains the '/dashboard/coll' path
    cy.url().should('include', '/dashboard/coll');
  });

  it('should navigate to Manage Order page', () => {
    // Click the "Manage Order" link
    cy.contains('Manage Order', { timeout: 10000 }).click();
    
    // Check that the URL contains the '/dashboard/order' path
    cy.url().should('include', '/dashboard/order');
  });
});