describe('Admin Sidebar Navigation Tests', () => {
  beforeEach(() => {
    // First, set the cookie to authenticate as an Admin
    cy.setCookie('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTg2MzIzMDhlMjA4YWJmYjFjYjgxNCIsImlhdCI6MTc0MTkzOTQ4NiwiZXhwIjoxNzQyNTQ0Mjg2fQ.8fLQiROhHK6E3lwqicfF_5xEt9lzGfuFa7r_Lgvqr30');
    cy.visit('/'); // Adjust the URL if necessary
    cy.get('#userModal', { timeout: 5000 }).click(); // Open user modal
    cy.get('#Dashboard', { timeout: 10000 }).click(); // Click on Dashboard to access admin sidebar
  });

  // it('should navigate to Manage Product page and add a product', () => {
  //   // Click the "Manage Product" link
  //   cy.contains('Manage Product', { timeout: 10000 }).click();
    
  //   // Check that the URL contains the '/dashboard/product' path
  //   cy.url().should('include', '/dashboard/product');

  //   cy.get('#create_product').click(); // Open create product modal

  //   cy.get('#basic_name', { timeout: 5000 }).should('be.visible').type('Test Product');
  //   cy.get('#basic_category', { timeout: 5000 }).click();
  //   cy.get('.ant-select-item-option-content', { timeout: 5000 }).contains('Women').click();
  //   cy.get('#basic_color', { timeout: 5000 }).type('Red');
  //   cy.get('#basic_coll', { timeout: 5000 }).click();
  //   cy.get('.ant-select-item-option-content', { timeout: 5000 }).contains('2025 Bộ sưu tập thu đông').click(); 
  //   cy.get('#basic_type', { timeout: 5000 }).click();
  //   cy.get('.ant-select-item-option-content', { timeout: 5000 }).contains('Đồ biển').click(); // Select the first type
  //   cy.get('#basic_description', { timeout: 5000 }).type('This is a test product description.');
  //   cy.get('#basic_brand', { timeout: 5000 }).type('Test Brand');
  //   cy.get('#basic_price', { timeout: 5000 }).type('100000');


  //   cy.contains('Button', 'Add Size Stock', {timeout: 5000}).click(); // Add a size stock entry
  //   cy.get('.ant-select', { timeout: 5000 }).eq(4).click();
  //   cy.get('.ant-select-dropdown')
  //   .contains('.ant-select-item-option-content', 'M', { timeout: 5000 })
  //   .click();

  //   cy.get('.ant-row')
  //   .last() // select the last row
  //   .find('input[type="number"]', { timeout: 5000 })
  //   .type('10');
    
  //   // Mock image upload
  //   const imageFile = 'test_image.jpg';
  //   cy.get('input[type="file"]').selectFile('cypress/fixtures/' + imageFile, { force: true });

  //   // Submit the form
  //   cy.get('.ant-modal-footer > .ant-btn-primary').click();

  //   // Verify success message
  //   cy.contains('Create succeed!', { timeout: 10000 }).should('be.visible');
  // });
  
//  it('should navigate to Manage Product page and add a product', () => {
//     cy.contains('Manage Product', { timeout: 10000 }).click();
//     cy.url().should('include', '/dashboard/product');
//     cy.get('#updateProduct', { timeout: 5000 }).click();
//     cy.get('#name').click();
//     cy.get('#name').type('updateTesting');
//     cy.get('.ant-row:nth-child(1) > .ant-col-8:nth-child(1)').click();
//     cy.get('.ant-upload > .ant-btn > span').click();
//     cy.get('.ant-btn-primary').click();

//   });

  // it('should navigate to Manage Product Type page and add product', () => {
  //   // Click the "Manage Product Type" link
  //   cy.contains('Manage Product Type', { timeout: 10000 }).click();
    
  //   // Check that the URL contains the '/dashboard/productType' path
  //   cy.url().should('include', '/dashboard/productType');

  //   cy.get('#create_productType').click();

  //   cy.get('#basic_name', { timeout: 5000 }).should('be.visible').type('Test ProductType');
  //   cy.get('#basic_description', { timeout: 5000 }).type('Test ProductType');
  //   const imageFile = 'test_image.jpg';
  //   cy.get('input[type="file"]').selectFile('cypress/fixtures/' + imageFile, { force: true });
  //   cy.get('.ant-modal-footer > .ant-btn-primary').click();
  //   cy.contains('Create succeed!', { timeout: 10000 }).should('be.visible');
  // });

  it('should update a productType', ()=> {
    cy.contains('Manage Product Type', {timeout: 10000}).click();
    cy.get('#product_type_update').click();
    cy.get('#basic_name', { timeout: 5000 }).should('be.visible').type(' Update testing');
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains('Create succeed!', { timeout: 10000 }).should('be.visible');
  });
  
  // it('should navigate to Manage Collection page', () => {
  //   // Click the "Manage Collection" link
  //   cy.contains('Manage Collection', { timeout: 10000 }).click();
    
  //   // Check that the URL contains the '/dashboard/coll' path
  //   cy.url().should('include', '/dashboard/coll');
  //   cy.get('#create-collection').click();
  //   cy.get('#basic_name', { timeout: 5000 }).should('be.visible').type('Test Collection');
  //   cy.get('#basic_description', { timeout: 5000 }).type('Test ProductType description');
  //   const imageFile = 'test_image.jpg';
  //   cy.get('input[type="file"]').selectFile('cypress/fixtures/' + imageFile, { force: true });
  //   cy.get('.ant-modal-footer > .ant-btn-primary').click();
  //   cy.contains('Create succeed!', { timeout: 10000 }).should('be.visible');
  // });

  //   it('should update a collection', ()=> {
  //   cy.contains('Manage Collection', {timeout: 10000}).click();
  //   cy.get('#update_coll').click();
  //   cy.get('#basic_name', { timeout: 5000 }).should('be.visible').type(' Update testing');
  //   cy.get('.ant-modal-footer > .ant-btn-primary').click();
  //   cy.contains('Create succeed!', { timeout: 10000 }).should('be.visible');
  // });

  // it('should navigate to Manage Order page', () => {
  //   // Click the "Manage Order" link
  //   cy.contains('Manage Order', { timeout: 10000 }).click();
    
  //   // Check that the URL contains the '/dashboard/order' path
  //   cy.url().should('include', '/dashboard/order');
  //   cy.get('#check_order', {timeout: 5000}).click();
  //   cy.contains('Payment status checked', { timeout: 10000 }).should('be.visible');
  //   cy.get('#update_order', {timeout: 5000}).click();
  //   cy.get('.ant-col-12:nth-child(1)').click();
  //   //cy.get('.ant-select-open .ant-select-selection-item').click();
  //   cy.get('.ant-select-item-option-content', { timeout: 5000 }).contains('Failed').click();
  //   cy.get('.ant-modal-footer > .ant-btn-primary').click();
  //   cy.contains('Update succeed', { timeout: 10000 }).should('be.visible');
  // });
});