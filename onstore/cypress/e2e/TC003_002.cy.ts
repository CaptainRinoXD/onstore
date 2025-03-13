describe('TC003-002: Kiểm tra chức năng tìm kiếm sản phẩm với tên sản phẩm đã có', () => {
  it('Tìm kiếm sản phẩm đã có', () => {
    cy.visit('/'); // Truy cập trang chính

    // Nhấn nút mở ô tìm kiếm (nếu cần)
    cy.get('button.bg-transparent.border-none').click();

    // Chặn API tìm kiếm để chờ phản hồi
    cy.intercept('GET', '**/product_search*').as('searchResults');

    // Nhập từ khóa tìm kiếm
    cy.get('#search-input').should('be.visible').type('Pant{enter}');

    // Chờ API trả về dữ liệu
    cy.wait('@searchResults');

    // Kiểm tra kết quả tìm kiếm hiển thị đúng
    cy.get('.p-2.hover\\:bg-gray-100.cursor-pointer.flex.gap-2')
      .should('exist')
      .and('be.visible');

    // Kiểm tra có đúng sản phẩm tìm kiếm hay không
    cy.contains('Pant').should('be.visible');
  });
});
