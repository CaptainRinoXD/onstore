interface CartItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  size: string;
  _id: string;
}

describe('TC008-003: Kiểm tra số lượng sản phẩm trong giỏ hàng', () => {
  it('Hiển thị đúng số lượng sản phẩm', () => {
    // Đặt cookie để bỏ qua đăng nhập
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTg2MzIzMDhlMjA4YWJmYjFjYjgxNCIsImlhdCI6MTc0MjQ5MjQwNywiZXhwIjoxNzQzMDk3MjA3fQ.WdHR-U6Y-480-YebZlljh1NJ_cTXAu-VBReeh9B4V9Q'
    );

    // Truy cập trang chủ
    cy.visit('/');

    // Mở giỏ hàng
    cy.get('#cartButton').click();
    cy.wait(1000); // Đợi giỏ hàng mở

    // Xác nhận giỏ hàng mở thành công
    cy.get('.MuiDrawer-paper').should('be.visible');
    cy.get('button').contains('XEM GIỎ HÀNG', { matchCase: false }).click();

    // Chặn API lấy giỏ hàng
    cy.intercept('GET', '/api/carts/**').as('getCart');

  });
});
