describe('template spec', () => {
it('should get a users', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/users/67cfdb0ce46ab385d613d8a1',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
})