describe('Kiểm tra đăng ký khi bỏ trống ô tài khoản', () => {
  beforeEach(() => {
    // Truy cập trang login trước mỗi bài kiểm thử
    cy.visit('http://localhost:3000/login');
  });

  it('Bắt buộc điền tài khoản', () => {
    // Click vào nút "Sign In" hoặc tương tự
    cy.get('.bg-green-600').click();

    // Xóa trường email hiện tại
    //cy.get('#email').click().clear();

    // Nhập email
    cy.get('#email').type('Quyen12345@gmail.com');

    // Nhập mật khẩu
    cy.get('#password').click().type('123456');

    // Click vào nút "Login" hoặc tương tự
    cy.get('.bg-blue-600').click();

    // Tương tác với bộ sưu tập
    // Click vào bộ sưu tập '2025 Bộ sưu tập mùa hè'
    //cy.get('#coll-2025\\ B\\1ED9\\ s\\1B0u\\ t\\1EADp\\ m\\F9\\ a\\ h\\E8').click();

    // Chọn một tùy chọn từ danh sách (giả định là tùy chọn thứ 4)
    //cy.get('div:nth-child(4) div:nth-child(1) > label').click();

    // Click vào bộ sưu tập '2025 Bộ sưu tập thu đông'
    //cy.get('#coll-2025\\ B\\1ED9\\ s\\1B0u\\ t\\1EADp\\ thu\\ \\111\\F4ng').click();
  });
});
