describe('Kiểm tra hiển thị danh mục sản phẩm trong danh mục Women ', () => {
  it('Hiển thị đúng và đầy đủ sản phẩm theo nhu cầu', () => {
    // Truy cập trang chính
  cy.visit('http://localhost:3000/');

  // Nhấn vào phần tử có class 'md:flex'
  cy.get('.md\\3A flex').click();

  // Kiểm tra xem đã chuyển hướng đến trang 'producttypes'
  //cy.url().should('include', '/producttypes');

  // Nhấn vào bộ lọc cụ thể (ví dụ: div thứ 3 với class filter-container)
  cy.get('div:nth-child(3) > .filter-container label').click();

  // Chọn bộ lọc giới tính "women"
  //cy.get('#gender-women').check(); // Dùng .check() cho checkbox hoặc radio button

  })
})