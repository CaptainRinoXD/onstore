describe('Kiểm tra chức năng tìm kiếm khi bỏ trống ô tìm kiếm', () => {
  it('Cần nhập tên hoặc loại sản phẩm để tìm kiếm', () => {
    // Truy cập trang chủ
    cy.visit('http://localhost:3000/');

    // Nhấn vào ô tìm kiếm
    //cy.get('#search-input').click();

    // Tương tác với phần tử có class ".size-6"
    cy.get('.bg-transparent > .size-6').click();

    // Kiểm tra trạng thái hoặc nội dung sau khi click
    cy.get('.bg-transparent > .size-6')
      .should('exist') // Đảm bảo phần tử vẫn tồn tại
      .should('be.visible'); // Kiểm tra phần tử có hiển thị không
  });
});
