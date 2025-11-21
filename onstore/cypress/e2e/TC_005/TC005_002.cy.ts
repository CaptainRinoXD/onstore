describe('Cập Nhật Số Lượng Sản Phẩm Trong Giỏ Hàng', () => {
  it('Kiểm tra cập nhật số lượng sản phẩm', () => {
    // 1. Mở trang chủ
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTg2MzIzMDhlMjA4YWJmYjFjYjgxNCIsImlhdCI6MTc0MjQ5MjQwNywiZXhwIjoxNzQzMDk3MjA3fQ.WdHR-U6Y-480-YebZlljh1NJ_cTXAu-VBReeh9B4V9Q'
    );

    // Truy cập trang chủ
    cy.visit('/');
    cy.visit('http://localhost:3000/cart');
    cy.get('.css-6dcmd1-MuiTypography-root').click();
    cy.get('.MuiInputBase-input').type('1');
    cy.get('.MuiInputBase-input').click();
  });
});
