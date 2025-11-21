describe('User Registration - Existing Account', () => {
  it('should show an error for an existing account', () => {
    cy.visit('/register')

    // Điền thông tin tài khoản đã tồn tại
    cy.get('#username').type('existinguser')
    cy.get('#email').type('existinguser@example.com')
    cy.get('#password').type('password123')
    //cy.get('#confirmPassword').type('password123')

    // Nhấn nút đăng ký
    cy.get('button[type="submit"]').click()

    // Kiểm tra lỗi hiển thị
    cy.contains('Registration failed').should('be.visible')
  })
})
