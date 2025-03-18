describe('Thanh toán với Ngân hàng', () => {
  beforeEach(() => {
    cy.setCookie(
      'refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkYjBjZTQ2YWIzODVkNjEzZDhhMSIsImlhdCI6MTc0MjI4MzcxMCwiZXhwIjoxNzQyODg4NTEwfQ.fIPNrbg3b98nwNReQevXyaUsJzJRSKpjaCV4zZ0OONE'
    );

    Cypress.on('uncaught:exception', (err) => {
      cy.log('⚠️ Lỗi bị bỏ qua:', err.message);
      return false;
    });
  });

  it('Thực hiện thanh toán qua ngân hàng thành công', () => {
    cy.visit('http://localhost:3000/cart');
    cy.get('.MuiButtonBase-root').should('be.visible').click();
    cy.url().should('include', '/pay');

    // Điền thông tin khách hàng
    cy.get('[id=":r0:"]').type('Nguyễn Văn A');
    cy.get('[id=":r1:"]').type('123 Đường ABC, TP.HCM');
    cy.get('[id=":r2:"]').type('0123456789');

    // Chọn phương thức thanh toán
    cy.contains('Chuyển khoản ngân hàng.').click({ force: true });

    // Chờ Stripe iframe load xong
    cy.get('iframe', { timeout: 30000 }) // Tăng timeout lên 30s
      .should('exist')
      .then(($iframe) => {
        const iframeSrc = $iframe.attr('src');
        if (!iframeSrc) {
          throw new Error('Không tìm thấy src của iframe Stripe');
        }

        // Kiểm tra xem iframe có phải là của Stripe không
        expect(iframeSrc).to.include('stripe');

        // Lấy origin của Stripe
        const stripeDomain = new URL(iframeSrc).origin;

        // Chuyển qua origin của Stripe
        cy.origin(stripeDomain, { args: { iframeSrc } }, ({ iframeSrc }) => {
          cy.visit(iframeSrc, { failOnStatusCode: false });

          // Chờ body của iframe load xong
          cy.get('body', { timeout: 15000 })
            .should('exist')
            .within(() => {
              // Chờ phần tử #Field-numberInput xuất hiện
              cy.get('#Field-numberInput', { timeout: 15000 })
                .should('be.visible')
                .type('4242424242424242', { delay: 50 });

              cy.get('#Field-expiryInput')
                .should('be.visible')
                .type('1230', { delay: 50 }); // MM/YY -> 12/30

              cy.get('#Field-cvcInput')
                .should('be.visible')
                .type('123', { delay: 50 });

              // Submit form
              cy.get('button[type="submit"]', { timeout: 15000 })
                .should('not.be.disabled')
                .click();
            });
        });
      });
  });
});
