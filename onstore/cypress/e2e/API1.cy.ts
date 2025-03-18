describe('API Login Test', () => {
  it('should login successfully', () => {
      cy.request({
          method: 'POST',
          url: 'http://localhost:3002/users/login',
          body: {
              email: 'nguyendangkhoa@example.com',
              password: 'password123'
          }
      }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('userId');
      });
  });
});
