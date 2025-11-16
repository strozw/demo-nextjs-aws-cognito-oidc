import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  const baseURL = 'http://localhost:3000';
  const testEmail = process.env.TEST_USER_EMAIL || '';
  const testPassword = process.env.TEST_USER_PASSWORD || '';

  // 環境変数のチェック
  if (!testEmail || !testPassword) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local file'
    );
  }

  // ログイン済みの状態でテストを開始するヘルパー関数
  async function login(page) {
    await page.goto(baseURL);
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForURL(/.*amazoncognito\.com.*/);
    // 視覚的に表示されているフォームを使用
    await page.fill('input[name="username"]:visible', testEmail);
    await page.fill('input[name="password"]:visible', testPassword);
    await page.click('input[type="submit"][name="signInSubmitButton"]:visible');
    await page.waitForURL(baseURL);
    await expect(page.getByText('ようこそ!')).toBeVisible();
  }

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('should display dashboard page when authenticated', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.getByRole('link', { name: 'ダッシュボードへ' }).click();
    await page.waitForURL(`${baseURL}/dashboard`);

    // ダッシュボードの要素を確認
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '保護されたコンテンツ' })).toBeVisible();
  });

  test('should display user information', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.goto(`${baseURL}/dashboard`);

    // ユーザー情報が表示されていることを確認
    await expect(page.getByText(/ユーザーID:/)).toBeVisible();
    await expect(page.getByText(/Email:/)).toBeVisible();
    await expect(page.getByText(testEmail)).toBeVisible();
  });

  test('should have protected content message', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.goto(`${baseURL}/dashboard`);

    // 保護されたコンテンツのメッセージを確認
    await expect(
      page.getByText('このページはログインしたユーザーのみアクセスできます。')
    ).toBeVisible();
  });

  test('should have logout button in header', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.goto(`${baseURL}/dashboard`);

    // ヘッダーのログアウトボタンを確認
    const logoutButton = page.locator('header').getByRole('button', { name: 'ログアウト' });
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toBeEnabled();
  });

  test('should navigate back to home', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.goto(`${baseURL}/dashboard`);

    // ホームに戻るボタンをクリック
    await page.getByRole('link', { name: 'ホームに戻る' }).click();
    await page.waitForURL(baseURL);

    // ホームページに戻っていることを確認
    await expect(page.getByText('ようこそ!')).toBeVisible();
  });

  test('should logout from dashboard', async ({ page }) => {
    // ログイン
    await login(page);

    // ダッシュボードに移動
    await page.goto(`${baseURL}/dashboard`);

    // ログアウト
    await page.locator('header').getByRole('button', { name: 'ログアウト' }).click();

    // ホームページにリダイレクトされ、ログアウト状態になることを確認
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ログインしてください')).toBeVisible();
  });

  test('should redirect unauthenticated users to home', async ({ page }) => {
    // 未認証状態でダッシュボードにアクセス
    await page.goto(`${baseURL}/dashboard`);

    // ホームページにリダイレクトされることを確認
    await expect(page).toHaveURL(baseURL);
    await expect(page.getByText('ログインしてください')).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // ログイン
    await login(page);
    await page.goto(`${baseURL}/dashboard`);

    // デスクトップサイズ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
  });
});
