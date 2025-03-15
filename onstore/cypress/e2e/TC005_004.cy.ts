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

    // Chặn API lấy giỏ hàng
    cy.intercept('GET', '/api/carts/**').as('getCart');

    // Đợi API lấy giỏ hàng hoàn thành
    cy.wait('@getCart').then((interception) => {
      if (!interception.response) {
        throw new Error('⛔ API không trả về phản hồi');
      }

      const cartData = interception.response.body;
      console.log('🔥 Dữ liệu giỏ hàng:', JSON.stringify(cartData, null, 2));

      if (!cartData || !cartData.items || !Array.isArray(cartData.items)) {
        throw new Error('⛔ Lỗi: Dữ liệu giỏ hàng không hợp lệ');
      }
    });
  });
});
