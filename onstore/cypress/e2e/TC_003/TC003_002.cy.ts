describe('TC003-002: Kiểm tra chức năng tìm kiếm sản phẩm với tên sản phẩm không có', () => {
  it('Tìm kiếm sản phẩm đã có', () => {
    cy.visit('/');

    // Click the search button to make the input visible
    cy.get('button.bg-transparent.border-none').click();

    // Wait for the search input to become visible
    cy.get('#search-input').should('be.visible');

    // Intercept the search API request
    cy.intercept('GET', '**/product_search*').as('searchResults');

    // Type the search term and press Enter
    cy.get('#search-input')
      .should('be.visible') // Ensure it's still visible just before typing
      .focus() // Explicitly focus the input
      .type('xyz123{enter}')
  });
});