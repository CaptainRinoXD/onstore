describe('Login Test', () => {
  it('should log in successfully', () => {
    // Truy cập trang login
    cy.visit('/login');

    // Nhập email và mật khẩu
    cy.get('#email').type('test@gmail.com');
    cy.get('#password').type('123456');

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]').click();

    // Kiểm tra xem có chuyển hướng đến trang chính hay không
    cy.url().should('include', '/');
  });
});
