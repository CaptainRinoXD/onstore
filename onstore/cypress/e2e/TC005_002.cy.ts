describe('TC008-001: Kiểm tra khả năng tăng số lượng sản phẩm trong giỏ hàng', () => {
  it('Tăng số lượng sản phẩm thành công', () => {
    // Đặt cookie để bỏ qua đăng nhập (bỏ qua bước đăng nhập nếu API hỗ trợ)
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );

    // Truy cập trang chủ
    cy.visit('/');

    // Mở giỏ hàng
    cy.get('#cartButton').click();
    cy.wait(1000); // Đợi giỏ hàng mở

    // Xác nhận giỏ hàng mở thành công
    cy.get('.MuiDrawer-paper').should('be.visible');
    cy.get('button').contains('XEM GIỎ HÀNG', { matchCase: false }).click();

    // Chặn API cập nhật giỏ hàng
    cy.intercept('PUT', '/api/carts/**').as('updateCart');

    // ✅ Tăng số lượng sản phẩm (nút "+")
    cy.get('input[type="number"]').clear().type('1').blur();
    cy.wait('@updateCart');
    cy.get('input[type="number"]').should('have.value', '10'); // Kiểm tra nếu hệ thống nhân 10 lần
  });
});
