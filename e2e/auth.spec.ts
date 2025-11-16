import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const baseURL = 'http://localhost:3000';
  const testEmail = process.env.TEST_USER_EMAIL || '';
  const testPassword = process.env.TEST_USER_PASSWORD || '';

  // 環境変数のチェック
  if (!testEmail || !testPassword) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local file'
    );
  }

  test.beforeEach(async ({ page }) => {
    // 各テストの前にクッキーとストレージをクリア
    await page.context().clearCookies();
    await page.goto(baseURL);
  });

  test('should display login button when not authenticated', async ({ page }) => {
    // ログインボタンが表示されていることを確認
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();

    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: 'AWS Cognito Auth Sample' })).toBeVisible();
    await expect(page.getByText('ログインしてください')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // Cognitoのログインページにリダイレクトされるまで待機
    await page.waitForURL(/.*amazoncognito\.com.*/, { timeout: 10000 });

    // メールアドレスとパスワードを入力
    await page.fill('input[name="username"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // サインインボタンをクリック
    await page.click('input[type="submit"][name="signInSubmitButton"]');

    // アプリケーションにリダイレクトされるまで待機
    await page.waitForURL(baseURL, { timeout: 15000 });

    // ログイン成功後の画面を確認
    await expect(page.getByText('ようこそ!')).toBeVisible();
    await expect(page.getByText('ログイン済みです')).toBeVisible();
    await expect(page.getByRole('link', { name: 'ダッシュボードへ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();

    // ユーザー情報が表示されていることを確認
    await expect(page.getByText(/Email:/)).toBeVisible();
    await expect(page.getByText(testEmail)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // まずログイン
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForURL(/.*amazoncognito\.com.*/);
    await page.fill('input[name="username"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('input[type="submit"][name="signInSubmitButton"]');
    await page.waitForURL(baseURL);

    // ログイン成功を確認
    await expect(page.getByText('ようこそ!')).toBeVisible();

    // ログアウトボタンをクリック
    await page.getByRole('button', { name: 'ログアウト' }).click();

    // ログアウト後、ログイン画面に戻ることを確認
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ログインしてください')).toBeVisible();
  });

  test('should redirect to home when accessing dashboard without login', async ({ page }) => {
    // 未認証状態でダッシュボードにアクセス
    await page.goto(`${baseURL}/dashboard`);

    // ホームページにリダイレクトされることを確認
    await expect(page).toHaveURL(baseURL);
    await expect(page.getByText('ログインしてください')).toBeVisible();
  });
});
