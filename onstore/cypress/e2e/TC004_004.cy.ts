describe('TC004-004: Kiểm tra thêm đúng sản phẩm vào giỏ hàng', () => {
  it('Chọn sản phẩm và thêm vào giỏ hàng', () => {
    cy.visit('/'); // Truy cập trang chính

    // Nhấn vào "Shop" để hiển thị danh mục sản phẩm
    cy.get('nav').contains('Shop').click();

    // Chọn một sản phẩm cụ thể, ví dụ: "Xuan Long Dress"
    cy.contains('Áo').click();

    // Nhấn nút "Thêm vào giỏ hàng"
    cy.get('.sc-ivxoEo.gaNIUe').click();
    // Kiểm tra giỏ hàng để đảm bảo sản phẩm đã được thêm
    //cy.get('svg.MuiSvgIcon-root').should('be.visible').click(); // Nhấn vào icon giỏ hàng

    cy.contains('Áo').should('be.visible'); // Kiểm tra sản phẩm đúng
  });
});
