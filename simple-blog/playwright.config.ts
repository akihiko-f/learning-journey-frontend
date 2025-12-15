import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* 並列実行設定 - DBを共有するためファイル間は順次実行 */
  fullyParallel: false,
  /* CI環境でのリトライ設定 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* ワーカー数 - DBを共有するため1に制限 */
  workers: 1,
  /* レポーター設定 */
  reporter: 'html',
  /* 共通設定 */
  use: {
    /* ベースURL */
    baseURL: 'http://localhost:3000',
    /* スクリーンショット設定 */
    screenshot: 'only-on-failure',
    /* ビデオ録画設定 */
    video: 'retain-on-failure',
    /* トレース設定 */
    trace: 'on-first-retry',
  },

  /* テスト対象ブラウザ */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // /* モバイルテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  /* 開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
