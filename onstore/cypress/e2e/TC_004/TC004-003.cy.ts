describe('Kiểm tra hiển thị danh sách sản phẩm trong danh mục sắp xếp theo giá từ cao xuống thấp', () => {
  it('Hiển thị đúng và đầy đủ sản phẩm theo nhu cầu', () => {
    // Truy cập trang chính
    cy.visit('http://localhost:3000/');

    // Nhấn vào phần tử có class 'md:flex'
    cy.get('.md\\3A flex').click();

    // Kiểm tra xem đã chuyển hướng đến trang 'producttypes'
    cy.url().should('include', '/producttypes');

    // Nhấn vào bộ lọc trong container cụ thể
    cy.get('.filter-container:nth-child(3) > div:nth-child(2) > label').click();

    // Nhấn vào phần tử có ID 'hl'
    //cy.get('#hl').click();

  })
})