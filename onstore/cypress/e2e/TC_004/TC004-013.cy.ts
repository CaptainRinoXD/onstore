describe('Kiểm tra hiển thị danh mục sản phẩm trong danh mục Quần áo thường ngày ', () => {
  it('danh mục sản phẩm trong danh mục Quần áo thường ngày', () => {
    // 1️⃣ Truy cập trang chủ
    cy.visit('http://localhost:3000/producttypes');
    //cy.get('div:nth-child(2) > .filter-container > div:nth-child(1) > label').click();

    // Click vào checkbox bằng cách ép buộc
    cy.get('div:nth-child(5) div:nth-child(5) > label').click({ force: true });
  });
});