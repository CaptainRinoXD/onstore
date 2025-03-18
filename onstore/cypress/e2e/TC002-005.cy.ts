describe('Kiểm tra đăng ký khi bỏ trống ô Email', () => {
  it('Yêu cầu điền ô Email', () => {
    // Truy cập trang chủ
    cy.visit('http://localhost:3000/');

    // Nhấn đúp vào modal để mở giao diện đăng nhập
    cy.get('#userModal').dblclick();

    // Kiểm tra URL chuyển hướng đến trang login
    cy.url().should('include', '/login');

    // Mở giao diện đăng nhập (nếu cần)
    //cy.get('.md\\3A flex').click();

    // Nhấn vào nút Sign In
    cy.get('.bg-green-600').click();

    // Nhập tên người dùng
    cy.get('#username')
      .click()
      .clear() // Đảm bảo nội dung trước đó bị xóa
      .type('Duong');

    // Nhập mật khẩu
    cy.get('#password')
      .click()
      .type('123456');

    // Click vào nút đăng nhập
    cy.get('.bg-blue-600').click();
  });
});
