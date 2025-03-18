describe('Kiểm tra đăng nhập khi bỏ trống ô tài khoản', () => {
  it('Hệ thống đăng nhập thất bại và yêu cầu điền ô tài khoản', () => {
        // Truy cập trang chính
    cy.visit('http://localhost:3000/');

    // Nhấn vào modal user
    cy.get('#userModal').click();

    // Kiểm tra xem đã chuyển hướng đến trang đăng nhập
    cy.url().should('include', '/login');

    // Nhấn vào ô email
    cy.get('#email').click();

    // Xử lý trường hợp selector ô nhập email không chính xác
    cy.get('.mb-6 > .mt-4:nth-child(3)').should('be.visible').click();

    // Nhấn vào ô nhập mật khẩu
    cy.get('#password').click();

    // Nhập mật khẩu
    cy.get('#password').type('123456');

    // Nhấn nút đăng nhập
    cy.get('.bg-blue-600').click();

  })
})