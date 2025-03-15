describe('Kiểm tra tổng giá trị giỏ hàng', () => {
  beforeEach(() => {
    // Truy cập trang giỏ hàng
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MTkzNTMxMywiZXhwIjoxNzQyNTQwMTEzfQ.QVcwKChZ4pOnTCuHITbKwkABXQcGaYa8FD6OwsBMY8E'
    );

    // Truy cập trang chủ
    cy.visit('/');

    // Mở giỏ hàng
    cy.get('#cartButton').click();
    cy.wait(1000); // Đợi giỏ hàng mở

    // Xác nhận giỏ hàng mở thành công
    cy.get('.MuiDrawer-paper').should('be.visible');
    cy.get('button').contains('XEM GIỎ HÀNG', { matchCase: false }).click();

    // Chờ giỏ hàng tải xong
    cy.intercept('GET', 'http://localhost:3002/api/carts/*').as('getCart');
    cy.wait('@getCart');
  });

  it('Tổng giá trị giỏ hàng phải chính xác', () => {
    // Lấy danh sách sản phẩm trong giỏ hàng
    cy.get('tbody tr').then((rows) => {
      let expectedTotal = 0;

      // Duyệt qua từng dòng sản phẩm để tính tổng
      cy.wrap(rows).each((row) => {
        cy.wrap(row)
          .find('td:nth-child(4)') // Cột giá sản phẩm
          .invoke('text')
          .then((priceText) => {
            const price = parseFloat(priceText.replace(/\D/g, '')); // Chuyển giá thành số

            cy.wrap(row)
              .find("input[type='number']") // Ô nhập số lượng
              .invoke('val')
              .then((qty) => {
                expectedTotal += price * Number(qty);
              });
          });
      });

      // Kiểm tra tổng giá trị giỏ hàng hiển thị
      cy.get('td.MuiTableCell-alignRight') // Chọn cột chứa tổng giá trị
        .last() // Chọn phần tử cuối cùng (tổng giá trị giỏ hàng)
        .invoke('text')
        .then((totalText) => {
          const displayedTotal = parseFloat(totalText.replace(/\D/g, ''));
          expect(displayedTotal).to.equal(expectedTotal);
        });
    });
  });
});
