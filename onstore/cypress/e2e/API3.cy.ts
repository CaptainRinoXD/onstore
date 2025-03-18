describe('template spec', () => {
 it('should get a product', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/products/67d39f221890e34239d4ccba',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
})