describe('Kiểm tra chức năng sắp xếp sản phẩm từ Z-A', () => {
  it('Sắp xếp sản phẩm từ Z-A và kiểm tra kết quả', () => {
    // 1️⃣ Truy cập trang chủ
    cy.visit('http://localhost:3000/producttypes');
    //cy.get('div:nth-child(2) > .filter-container > div:nth-child(1) > label').click();

    // Click vào checkbox bằng cách ép buộc
    cy.get('#gender-women').click({ force: true });
  });
});