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

   it('should get a product', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/products/67d39f221890e34239d4ccba',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

   it('should get all collection', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/collections',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should get a users', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3002/api/users/67cfdb0ce46ab385d613d8a1',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

});