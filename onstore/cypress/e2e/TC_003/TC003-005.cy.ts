describe('Kiểm tra chức năng tìm kiếm với từ khóa không liên quan', () => {
  it('Không hiển thị sản phẩm đang tìm kiếm', () => {
    // Truy cập trang chủ
    cy.visit('http://localhost:3000/');

    // Nhấn vào nút hoặc phần tử đầu tiên với class '.size-6'
    cy.get('.bg-transparent > .size-6').first().click();

    // Nhấn vào ô tìm kiếm
    cy.get('#search-input').click();

    // Nhấn vào một phần tử khác với class '.md:flex'
    cy.get('.md\\3A flex').click();

    // Nhấn lại vào phần tử '.size-6'
    cy.get('.bg-transparent > .size-6').click();

    // Nhập liệu vào ô tìm kiếm
    cy.get('#search-input')
      .type('máy')
      //.type('{backspace}');

    // Nhấn lại vào nút '.size-6'
    //cy.get('.bg-transparent > .size-6').click();
  });
});
