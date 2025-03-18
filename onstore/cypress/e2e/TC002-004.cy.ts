describe('Kiểm tra đăng ký khi bỏ trống ô mật khẩu', () => {
  it('Yêu cầu điền ô mật khẩu', () => {
    // Truy cập trang chủ
    cy.visit('http://localhost:3000/');

    // Nhấn vào nút mở modal đăng nhập
    cy.get('#userModal').click();

    // Kiểm tra xem URL đã chuyển đến trang login hay chưa
    cy.url().should('include', '/login');

    // Click vào nút "Sign In"
    cy.get('.bg-green-600').click();

    // Xóa nội dung hiện có và nhập tên người dùng
    cy.get('#username')
      .click()
      .clear()
      .type('quyen');

    // Nhập email
    cy.get('#email')
      .click()
      .type('Quyen123@gmail.com');

    // Click vào nút "Login"
    cy.get('.bg-blue-600').click();
  });
});
