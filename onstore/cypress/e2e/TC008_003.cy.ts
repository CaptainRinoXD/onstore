describe('Thanh toán với MoMo', () => {
  it('Thực hiện thanh toán qua MoMo thành công', () => {
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );

    // Truy cập giỏ hàng
    cy.visit('http://localhost:3000/cart');

    // Nhấn nút đặt hàng để vào trang thanh toán
    cy.get('.MuiButtonBase-root').should('be.visible').click();

    // Kiểm tra đã chuyển đến trang thanh toán
    cy.url().should('include', '/pay');

    // Điền thông tin khách hàng
    cy.get('[id=":r0:"]').type('Nguyễn Văn A'); // Nhập tên
    cy.get('[id=":r1:"]').type('123 Đường ABC, TP.HCM'); // Nhập địa chỉ
    cy.get('[id=":r2:"]').type('0123456789'); // Nhập số điện thoại

    // Chọn phương thức thanh toán **MoMo**
    cy.get('input[value="MOMO"]').check({ force: true });

    // Nhấn nút đặt hàng
    cy.get('.MuiButton-root').click();

    // Kiểm tra chuyển hướng đến trang thanh toán MoMo
    //cy.url().should('include', 'https://momo.vn/');

    // Hoặc kiểm tra thông báo xác nhận đơn hàng đã gửi đi
    //cy.contains('Đơn hàng của bạn đã được xử lý qua MoMo').should('exist');
  });
});
