describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login'); // Mở trang đăng nhập trước mỗi test case
  });

  // 🔴 Kiểm tra đăng nhập với tài khoản sai tên đăng nhập
  it('Fails login with invalid username', () => {
    cy.get('#email').type('invaliduser@gmail.com'); // Nhập email không hợp lệ
    cy.get('#password').type('123456'); // Nhập mật khẩu hợp lệ
    cy.get('button[type="submit"]').click(); // Nhấn đăng nhập

    // Hệ thống phải báo lỗi và yêu cầu nhập lại tài khoản
    cy.contains('.text-red-500', 'User not found').should('be.visible');
  });

  // 🔴 Kiểm tra đăng nhập với tài khoản sai mật khẩu
  it('Fails login with incorrect password', () => {
    cy.get('#email').type('test@gmail.com'); // Nhập email hợp lệ
    cy.get('#password').type('wrongpassword'); // Nhập mật khẩu không hợp lệ
    cy.get('button[type="submit"]').click(); // Nhấn đăng nhập

    // Hệ thống phải báo lỗi và yêu cầu nhập lại tài khoản và mật khẩu
    cy.contains('.text-red-500', 'Invalid credentials').should('be.visible');
  });

  // 🔴 Kiểm tra đăng nhập với tài khoản sai cả tên đăng nhập và mật khẩu
  it('Fails login with wrong username and password', () => {
    cy.get('#email').type('wronguser@gmail.com'); // Nhập email không hợp lệ
    cy.get('#password').type('wrongpassword'); // Nhập mật khẩu không hợp lệ
    cy.get('button[type="submit"]').click(); // Nhấn đăng nhập

    // Hệ thống phải báo lỗi và yêu cầu nhập lại tài khoản và mật khẩu
    cy.contains('.text-red-500', 'User not found').should('be.visible');
  });
});
