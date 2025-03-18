describe('API Login Test', () => {
  it('should login successfully', () => {
      cy.request({
          method: 'POST',
          url: 'http://localhost:3002/api/users/login',
          body: {
              email: 'test@gmail.com',
              password: '123456'
          }
      }).then((response) => {
          expect(response.status).to.eq(200);
      });
  });
});
