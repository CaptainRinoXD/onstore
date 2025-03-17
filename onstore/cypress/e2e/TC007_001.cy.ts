describe('Kiểm tra trang thanh toán', () => {
  beforeEach(() => {
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );
    cy.visit('/pay'); // Điều hướng đến trang thanh toán
  });

  it('Kiểm tra sản phẩm và tổng giá trị đơn hàng', () => {
    // Kiểm tra sản phẩm hiển thị đúng
    cy.contains('Tank top đi chơi mùa hè').should('exist');

    // Kiểm tra giá trị sản phẩm
    cy.contains('150.000₫').should('exist');

    // Kiểm tra tổng đơn hàng (có thể thay bằng selector cụ thể hơn)
    cy.contains('Tổng').parent().should('contain', '150.000₫');
  });

  it('Kiểm tra form thanh toán hoạt động', () => {
    // Nhập thông tin khách hàng
    cy.get('[id=":r0:"]').type('Nguyễn Văn A'); // Họ và Tên
    cy.get('[id=":r1:"]').type('123 Đường ABC, Quận 1'); // Địa chỉ
    cy.get('[id=":r2:"]').type('0987654321'); // Số điện thoại

    // Kiểm tra giá trị đã nhập
    // cy.get('input[name="fullname"]').should('have.value', 'Nguyễn Văn A');
    // cy.get('input[name="address"]').should('have.value', '123 Đường ABC, Quận 1');
    // cy.get('input[name="phone"]').should('have.value', '0987654321');
  });

  it('Chọn phương thức thanh toán và đặt hàng', () => {
    // Chọn phương thức thanh toán (Tiền mặt)
    cy.contains('150.000₫').should('exist');


    // Kiểm tra đã chọn đúng
    //cy.get('input[type="radio"][value="cash"]').should('be.checked');

    // Nhấn nút đặt hàng
    //cy.contains('ĐẶT HÀNG').click();

    // Kiểm tra chuyển hướng hoặc thông báo đơn hàng thành công
    // cy.url().should('include', '/order-success'); // Hoặc kiểm tra nội dung thông báo
    // cy.contains('Đơn hàng của bạn đã được xác nhận').should('exist');
  });
});
