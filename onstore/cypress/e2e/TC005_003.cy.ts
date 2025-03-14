describe('TC008-002: Kiểm tra giảm số lượng sản phẩm trong giỏ hàng', () => {
  it('Giảm số lượng sản phẩm thành công', () => {
    // Đặt cookie để bỏ qua đăng nhập (nếu API hỗ trợ)
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );

    // Truy cập trang giỏ hàng trực tiếp
    cy.visit('/cart');

    // Chặn API cập nhật giỏ hàng
    cy.intercept('PUT', '/api/carts/**').as('updateCart');

    // **🔻 Giảm số lượng sản phẩm**
    cy.get('.MuiButtonGroup-root button').eq(0).click(); // Nút "-"

    // Chờ cập nhật giỏ hàng
    cy.wait('@updateCart');
    cy.wait(1000);

    // Kiểm tra số lượng đã giảm xuống (nếu ban đầu là 2 thì giảm còn 1)
    cy.get('.MuiInputBase-input[type="number"]').should('have.value', '1');
  });
});
