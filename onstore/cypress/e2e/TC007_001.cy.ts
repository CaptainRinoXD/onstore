describe('Kiểm tra trang thanh toán', () => {
  beforeEach(() => {
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );
    cy.visit('http://localhost:3000/pay'); // Điều hướng đến trang thanh toán
  });

  it('Kiểm tra sản phẩm và tổng giá trị đơn hàng', () => {
    // Kiểm tra sản phẩm hiển thị đúng
    cy.contains('Tank top đi chơi mùa hè').should('exist');

    // Kiểm tra giá trị sản phẩm
    cy.contains('150.000₫').should('exist');

    // Kiểm tra tổng đơn hàng (có thể thay bằng selector cụ thể hơn)
    cy.contains('Tổng').parent().should('contain', '150.000₫');
    cy.contains('x').parent().should('contain', '1'); 
  });
});
