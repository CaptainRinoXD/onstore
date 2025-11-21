describe('Bộ lọc sản phẩm theo giá', () => {
  it('Lọc sản phẩm từ thấp đến cao', () => {
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/producttypes');
    cy.wait('@getProducts'); // Chờ API trả về dữ liệu

    cy.contains('LOW TO HIGH').click();
    cy.wait(2000);
    cy.get('.ant-card-meta-description')
      .should('exist')
      .then(($els) => {
        const priceList = $els
          .toArray()
          .map((el) => parseInt(el.innerText.replace(/\D/g, '')));
        expect(priceList).to.deep.equal([...priceList].sort((a, b) => a - b));
      });
  });

  it('Lọc sản phẩm từ cao đến thấp', () => {
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/producttypes');
    cy.wait('@getProducts');

    cy.contains('HIGH TO LOW').click();
    cy.wait(2000);
    cy.get('.ant-card-meta-description')
      .should('exist')
      .then(($els) => {
        const priceList = $els
          .toArray()
          .map((el) => parseInt(el.innerText.replace(/\D/g, '')));
        expect(priceList).to.deep.equal([...priceList].sort((a, b) => b - a));
      });
  });
});
