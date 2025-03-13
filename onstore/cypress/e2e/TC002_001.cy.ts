describe('User Registration - New Account', () => {
  it('should register successfully with a new account', () => {
    cy.visit('/register')

    // Điền thông tin đăng ký
    cy.get('#username').type('newuser')
    cy.get('#email').type('newuser@example.com')
    cy.get('#password').type('password123')
    //cy.get('#confirmPassword').type('password123')

    // Nhấn nút đăng ký
    cy.get('button[type="submit"]').click()

    // Kiểm tra đăng ký thành công (chuyển hướng hoặc hiển thị thông báo)
    cy.url().should('include', '/') // Nếu sau đăng ký chuyển hướng về trang chính
    cy.contains('Registration successful').should('be.visible') // Kiểm tra thông báo thành công
  })
})
