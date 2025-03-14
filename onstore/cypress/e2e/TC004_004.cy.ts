describe('TC004-004: Kiểm tra thêm đúng sản phẩm vào giỏ hàng', () => {

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

    cy.get('nav').contains('Shop').click();

    // Chọn một sản phẩm cụ thể, ví dụ: "Xuan Long Dress"
    cy.contains('Áo').click();
    cy.contains('Áo').click();

    // Nhấn nút "Thêm vào giỏ hàng"
    cy.get('.sc-ivxoEo.gaNIUe').click();
    // Kiểm tra giỏ hàng để đảm bảo sản phẩm đã được thêm
    cy.get('svg.MuiSvgIcon-root').should('be.visible').click(); // Nhấn vào icon giỏ hàng
    cy.contains('Áo').should('be.visible'); // Kiểm tra sản phẩm đúng
  });

  // it('Chọn sản phẩm và thêm vào giỏ hàng', () => {
  //   cy.visit('/'); // Truy cập trang chính

  //   // Nhấn vào "Shop" để hiển thị danh mục sản phẩm
  //   cy.get('nav').contains('Shop').click();

  //   // Chọn một sản phẩm cụ thể, ví dụ: "Xuan Long Dress"
  //   cy.contains('Áo').click();

  //   // Nhấn nút "Thêm vào giỏ hàng"
  //   cy.get('.sc-ivxoEo.gaNIUe').click();
  //   // Kiểm tra giỏ hàng để đảm bảo sản phẩm đã được thêm
  //   cy.get('svg.MuiSvgIcon-root').should('be.visible').click(); // Nhấn vào icon giỏ hàng
  //   cy.contains('Áo').should('be.visible'); // Kiểm tra sản phẩm đúng
  // });
});
