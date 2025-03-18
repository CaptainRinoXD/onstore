describe('User Registration', () => {
  it('should register a new user', () => {
    const username = `anime${Date.now()}`;
    const email = `anime${Date.now()}@example.com`;
    const password = 'password123';

    cy.request({
      method: 'POST',
      url: 'http://localhost:3002/users/registration',
      body: {
        username: username,
        email: email,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
});