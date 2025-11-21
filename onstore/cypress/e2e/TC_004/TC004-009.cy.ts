describe('Kiểm tra hiển thị danh sách sản phẩm trong danh mục 2025 Bộ sưu tập cho mùa lễ hội', () => {
  it('danh sách sản phẩm trong danh mục 2025 Bộ sưu tập cho mùa lễ hội', () => {
    // 1️⃣ Truy cập trang chủ
    cy.visit('http://localhost:3000/producttypes');
    //cy.get('div:nth-child(2) > .filter-container > div:nth-child(1) > label').click();

    // Click vào checkbox bằng cách ép buộc
    cy.get('div:nth-child(4) div:nth-child(3) > label').click({ force: true });
  });
});