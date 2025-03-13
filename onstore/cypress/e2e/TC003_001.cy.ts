describe('TC003-001: Kiểm tra tìm kiếm sản phẩm có trong CSDL', () => {
  it('Tìm kiếm sản phẩm đã có', () => {
    cy.visit('/'); // Truy cập trang chính
    cy.get('button.bg-transparent.border-none').click();
    cy.get('#search-input').should('be.visible').type('Dress');

    // Nhập tên sản phẩm
    cy.get('#search-input').type('{enter}'); // Nhấn Enter

    // Kiểm tra kết quả
    cy.get('.p-2.hover\\:bg-gray-100.cursor-pointer.flex.gap-2')
  .should('exist');
 // Đảm bảo có sản phẩm hiển thị
    cy.contains('Dress').should('be.visible'); // Kiểm tra đúng sản phẩm
  });
});
