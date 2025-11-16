import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  const baseURL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(baseURL);
  });

  test('should display the main heading and description', async ({ page }) => {
    // メインタイトルの確認
    await expect(page.getByRole('heading', { name: 'AWS Cognito Auth Sample', exact: true })).toBeVisible();

    // サブタイトルの確認
    await expect(page.getByText('Next.js 16 + React 19.2 + AWS Cognito')).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // ページが正しく表示されている
    await expect(page).toHaveURL(baseURL);

    // カードコンテナが存在する
    const card = page.locator('.rounded-lg.border.bg-card');
    await expect(card).toBeVisible();
  });

  test('should display login section when not authenticated', async ({ page }) => {
    // ログインセクションの見出し
    await expect(page.getByRole('heading', { name: 'ログインしてください' })).toBeVisible();

    // 説明文
    await expect(page.getByText('AWS Cognito で認証を行います')).toBeVisible();

    // ログインボタン
    const loginButton = page.getByRole('button', { name: 'ログイン' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('should have responsive layout', async ({ page }) => {
    // デスクトップサイズ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: 'AWS Cognito Auth Sample' })).toBeVisible();

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: 'AWS Cognito Auth Sample' })).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'AWS Cognito Auth Sample' })).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    // ページタイトルを確認
    await expect(page).toHaveTitle(/AWS Cognito/);
  });
});
