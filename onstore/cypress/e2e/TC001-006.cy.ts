describe('Kiểm tra đăng nhập khi bỏ trống ô mật khẩu', () => {
    it('Hệ thống đăng nhập thất bại và yêu cầu điền ô mật khẩu', () => {
        // Truy cập trang chính
    cy.visit('http://localhost:3000/');

    // Nhấn vào modal user
    cy.get('#userModal').click();

    // Kiểm tra xem đã chuyển hướng đến trang đăng nhập
    cy.url().should('include', '/login');

    // Nhấn vào ô nhập email
    cy.get('#email').click();

    // Xóa nội dung hiện tại trong ô email (nếu có)
    cy.get('#email').clear();

    // Nhập email
    cy.get('#email').type('Test@gmail.com');

    // Nhấn vào ô mật khẩu
    cy.get('#password').click();

    // Nhấn vào nút đăng nhập
    cy.get('.bg-blue-600').click();
    })
  })