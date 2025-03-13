describe('TC003-003: Kiểm tra chức năng tìm kiếm sản phẩm theo loại', () => {
  it('Tìm kiếm sản phẩm theo loại', () => {
    cy.visit('/'); // Truy cập trang chính

    // Nhấn nút mở ô tìm kiếm (nếu cần)
    cy.get('button.bg-transparent.border-none').click();

    // Chặn API tìm kiếm để chờ phản hồi
    cy.intercept('GET', '**/product_search*').as('searchResults');

    // Nhập loại sản phẩm cần tìm (ví dụ: "Shirt")
    cy.get('#search-input').should('be.visible').type('Shirt{enter}');

    // Chờ API trả về dữ liệu
    cy.wait('@searchResults');

    // Kiểm tra kết quả tìm kiếm có tồn tại
    cy.get('.p-2.hover\\:bg-gray-100.cursor-pointer.flex.gap-2')
      .should('exist')
      .and('be.visible');

    // Kiểm tra danh sách sản phẩm có chứa loại đã tìm
    cy.contains('Shirt').should('be.visible');
  });
});
