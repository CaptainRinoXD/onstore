describe('Kiểm tra đăng ký tài khoản khi bỏ trống cả 3 ô tài khoản, mật khẩu và email', () => {
  it('Yêu cầu điền đầy đủ thông tin', () => {
    // Truy cập trang chủ
    cy.visit('http://localhost:3000/');

    // Nhấn vào nút modal (biểu tượng mở giao diện đăng nhập)
    cy.get('#userModal > path').click();

    // Kiểm tra URL chuyển hướng đến trang login
    cy.url().should('include', '/login');

    // Nhấn vào nút "Sign In"
    cy.get('.bg-green-600').click();

    // Tương tác với trường nhập liệu Username
    cy.get('#username').click();

    // Tương tác với trường nhập liệu Email
    cy.get('#email').click();

    // Chọn một số tùy chọn khác nếu cần (tùy theo UI)
    cy.get('.mb-4:nth-child(3) > .text-sm').click();

    // Nhập mật khẩu
    cy.get('#password')
      .click()
      .type('123456'); // Bạn có thể thay bằng mật khẩu thực tế

    // Nhấn nút Login
    cy.get('.bg-blue-600').click();
  });
});
