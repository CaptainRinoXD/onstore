describe('Thanh toán với Stripe', () => {
  it('Thực hiện thanh toán thành công', () => {
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MjI4MzcxMCwiZXhwIjoxNzQyODg4NTEwfQ.fIPNrbg3b98nwNReQevXyaUsJzJRSKpjaCV4zZ0OONE'
    );
    // Truy cập giỏ hàng
    cy.visit('http://localhost:3000/cart');

    // Chờ nút đặt hàng xuất hiện và nhấn vào
    cy.get('.MuiButtonBase-root').should('be.visible').click();

    // Kiểm tra đã chuyển đến trang thanh toán
    cy.url().should('include', '/pay');

    // Chặn và theo dõi request gửi đến Stripe
    cy.intercept('POST', '**/v1/payment_intents/**').as('stripePayment');

    // Điền thông tin thanh toán
    cy.get('[id=":r0:"]').type('Nguyễn Văn A'); // Nhập tên
    cy.get('[id=":r1:"]').type('123 Đường ABC, TP.HCM'); // Nhập địa chỉ
    cy.get('[id=":r2:"]').type('0123456789'); // Nhập số điện thoại

    // Nhấn vào nút xác nhận thanh toán
    cy.get('.MuiButton-root').click();

    // Kiểm tra request thanh toán gửi đến Stripe
    //cy.wait('@stripePayment').its('response.statusCode').should('eq', 200);

    // Kiểm tra đã được chuyển hướng đến trang thanh toán Stripe
    //cy.url().should('include', 'https://checkout.stripe.com');
  });
});
