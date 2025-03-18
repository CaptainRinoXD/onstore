describe('template spec', () => {
 it('should get all collection', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/collections',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
})