describe('Hiển thị danh sách sản phẩm trong danh mục', () => {
  it('Hiển thị sản phẩm khi vào trang Shop', () => {
    cy.visit('/producttypes'); // Truy cập trang danh mục sản phẩm
    cy.get('.ant-col-6').should('exist'); // Đảm bảo có sản phẩm hiển thị
    cy.get('.ant-col-6').should('have.length.at.least', 1); // Kiểm tra có ít nhất 1 sản phẩm
  });
});
