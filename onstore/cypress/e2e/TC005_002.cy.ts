describe('TC008-001: Kiểm tra khả năng thêm bớt số lượng sản phẩm trong giỏ hàng', () => {
  it('Tăng, giảm số lượng sản phẩm thành công', () => {
    // Đặt cookie để bỏ qua đăng nhập (nếu API hỗ trợ)
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );

    // Truy cập trang chủ (nếu đã có token, hệ thống sẽ tự động login)
    cy.visit('/');

    // Điều hướng đến trang sản phẩm
    cy.get('nav').contains('Shop').click();
    cy.contains('Áo').click();

    // Chặn API giỏ hàng
    cy.intercept('POST', '/api/carts/**').as('addToCart');
    cy.intercept('PUT', '/api/carts/**').as('updateCart');

    // Thêm sản phẩm vào giỏ hàng
    cy.get('button').contains('ADD TO CART').click();
    cy.wait('@addToCart');

    // Mở giỏ hàng
    cy.get('button').contains('XEM GIỎ HÀNG', { matchCase: false }).click();
    cy.get('.MuiDrawer-paper').should('be.visible');

    // Kiểm tra sản phẩm đã có trong giỏ hàng
    //cy.get('.MuiListItem-root').should('contain', 'Áo');

    // ✅ Cách 1: Dùng nút "+" để tăng số lượng
    cy.get('.MuiButtonGroup-root button').eq(0).click();
    cy.wait('@updateCart');
    cy.wait(2000); 
    // Kiểm tra số lượng đã tăng lên 2
    cy.get('.MuiInputBase-input[type="number"]').should('have.value', '2');

    
  });
});
