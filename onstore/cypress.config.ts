import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/', // Base URL cho các test
    chromeWebSecurity: false, // Tắt bảo mật web để làm việc với iframe từ các domain khác
    setupNodeEvents(on, config) {
      // Có thể thêm các plugin hoặc event listeners tùy chỉnh ở đây
    },
  },
});
