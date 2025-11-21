import { TIMEOUT } from "dns";

describe('Login Test', () => {
  it('should log in successfully', () => {
    // Truy cập trang login
    cy.visit('/login');

    // Nhập email và mật khẩu
    cy.get('#email', { timeout: 100000 }).type('test@gmail.com', { timeout: 1000000 });
    cy.get('#password', { timeout: 100000 }).type('123456', { timeout: 1000000 });

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]', { timeout: 100000 }).click(), { timeout: 100000 };

    // Kiểm tra xem có chuyển hướng đến trang chính hay không
    cy.url().should('include', '/');
  });
});
