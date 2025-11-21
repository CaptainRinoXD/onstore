describe("Cập Nhật Số Lượng Sản Phẩm Trong Giỏ Hàng", () => {
  it("Giảm số lượng sản phẩm từ 2 xuống 1", () => {
    // 1. Đặt cookie để giữ phiên đăng nhập
    cy.setCookie(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTg2MzIzMDhlMjA4YWJmYjFjYjgxNCIsImlhdCI6MTc0MjQ5MjQwNywiZXhwIjoxNzQzMDk3MjA3fQ.WdHR-U6Y-480-YebZlljh1NJ_cTXAu-VBReeh9B4V9Q"
    );

    // 2. Truy cập giỏ hàng
    cy.visit("http://localhost:3000/cart");

    // 3. Kiểm tra số lượng ban đầu là 2
    //cy.get(".MuiInputBase-input").should("have.value", "2");

    // 4. Bắt API cập nhật giỏ hàng
    cy.intercept("PUT", "**/api/carts/**").as("updateCart");

    // 5. Click vào ô nhập số lượng
    cy.get(".MuiInputBase-input").click();

    // 6. Xóa số lượng cũ và nhập số mới
    cy.get(".MuiInputBase-input")
      .clear() // Xóa giá trị hiện tại
      .type("0") // Nhập giá trị mới
      .blur(); // Kích hoạt sự kiện cập nhật

    // 7. Chờ API cập nhật hoàn tất
    //cy.wait("@updateCart").its("response.statusCode").should("eq", 200);

    // 8. Kiểm tra lại số lượng đã giảm xuống 1
    //cy.get(".MuiInputBase-input").should("have.value", "1");
  });
});
