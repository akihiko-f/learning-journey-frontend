import { test, expect } from '@playwright/test';

/**
 * 認証機能のE2Eテスト
 * テスト設計書: docs/blog-test-design.md
 *
 * 注意: 認証テストはDBを共有するため、並列実行ではなくシリアル実行する
 * これにより、reset-dbやcreate-userの競合を防ぐ
 */
test.describe.configure({ mode: 'serial' });

// 各テストの前にデータベースをクリーンアップ
test.beforeEach(async ({ page }) => {
  // データベースリセットAPIを呼び出す
  const response = await page.request.post('/api/test/reset-db');
  expect(response.ok()).toBeTruthy();
});

test.describe('ユーザー登録機能', () => {
  /**
   * TC-001: 正常系 - 有効な情報で新規登録
   * 優先度: P0 (Critical)
   */
  test('TC-001: 有効な情報で新規登録できる', async ({ page }) => {
    // 前提条件: 登録ページにアクセス
    await page.goto('/register');

    // テスト手順1: email-inputにメールアドレスを入力
    await page.getByTestId('email-input').fill('user@example.com');

    // テスト手順2: username-inputにユーザー名を入力
    await page.getByTestId('username-input').fill('johndoe');

    // テスト手順3: name-inputに表示名を入力
    await page.getByTestId('name-input').fill('John Doe');

    // テスト手順4: password-inputにパスワードを入力
    await page.getByTestId('password-input').fill('Password123');

    // テスト手順5: password-confirm-inputにパスワード確認を入力
    await page.getByTestId('password-confirm-input').fill('Password123');

    // テスト手順6: register-buttonをクリック
    await page.getByTestId('register-button').click();

    // 期待結果1: 成功メッセージが表示される
    await expect(page.getByTestId('success-message')).toBeVisible();

    // 期待結果2: トップページにリダイレクトされる
    await expect(page).toHaveURL('/');

    // 期待結果3: ヘッダーにuser-menu-buttonが表示される(ログイン状態)
    await expect(page.getByTestId('user-menu-button')).toBeVisible();
  });

  /**
   * TC-002: 異常系 - メールアドレスが不正な形式
   * 優先度: P1 (High)
   */
  test('TC-002: メールアドレスが不正な形式の場合エラーが表示される', async ({ page }) => {
    await page.goto('/register');

    // 不正なメールアドレスを入力
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('username-input').fill('johndoe');
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('password-confirm-input').fill('Password123');
    await page.getByTestId('register-button').click();

    // 期待結果1: エラーメッセージが表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('有効なメールアドレスを入力してください');

    // 期待結果2: email-inputがフォーカスされる
    await expect(page.getByTestId('email-input')).toBeFocused();

    // 期待結果3: aria-invalid="true"が設定される
    await expect(page.getByTestId('email-input')).toHaveAttribute('aria-invalid', 'true');
  });

  /**
   * TC-003: 異常系 - パスワードが短すぎる
   * 優先度: P1 (High)
   */
  test('TC-003: パスワードが8文字未満の場合エラーが表示される', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('username-input').fill('johndoe');
    await page.getByTestId('name-input').fill('John Doe');
    // 5文字のパスワード
    await page.getByTestId('password-input').fill('Pass1');
    await page.getByTestId('register-button').click();

    // 期待結果: エラーメッセージが表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('パスワードは8文字以上で入力してください');
  });

  /**
   * TC-007: 境界値 - パスワード最小文字数(8文字)
   * 優先度: P2 (Medium)
   */
  test('TC-007: パスワードが8文字ちょうどの場合登録できる', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('email-input').fill('user2@example.com');
    await page.getByTestId('username-input').fill('johndoe2');
    await page.getByTestId('name-input').fill('John Doe');
    // 8文字のパスワード
    await page.getByTestId('password-input').fill('Pass123!');
    await page.getByTestId('password-confirm-input').fill('Pass123!');
    await page.getByTestId('register-button').click();

    // 期待結果: 登録が成功する
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

test.describe('ログイン機能', () => {
  // ログインテスト用のユーザーを事前作成（APIで直接作成）
  // 登録テストとの競合を避けるため、ログイン専用のメールアドレスを使用
  test.beforeEach(async ({ page }) => {
    // テストユーザーをAPIで作成（ログイン状態にならない）
    const response = await page.request.post('/api/test/create-user', {
      data: {
        email: 'login-test@example.com',
        username: 'loginuser',
        name: 'Login Test User',
        password: 'Password123',
      },
    });
    expect(response.ok()).toBeTruthy();
  });

  /**
   * TC-011: 正常系 - 有効な認証情報でログイン
   * 優先度: P0 (Critical)
   *
   * 前提条件: login-test@example.com / Password123 で登録済み
   */
  test('TC-011: 有効な認証情報でログインできる', async ({ page }) => {
    // 前提条件: ログインページにアクセス
    await page.goto('/login');

    // テスト手順1: email-inputにメールアドレスを入力
    await page.getByTestId('email-input').fill('login-test@example.com');

    // テスト手順2: password-inputにパスワードを入力
    await page.getByTestId('password-input').fill('Password123');

    // テスト手順3: login-buttonをクリック
    await page.getByTestId('login-button').click();

    // 期待結果1: トップページにリダイレクトされる
    await expect(page).toHaveURL('/');

    // 期待結果2: ヘッダーにuser-menu-buttonが表示される
    await expect(page.getByTestId('user-menu-button')).toBeVisible();
  });

  /**
   * TC-012: 異常系 - パスワードが間違っている
   * 優先度: P1 (High)
   */
  test('TC-012: パスワードが間違っている場合エラーが表示される', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('email-input').fill('login-test@example.com');
    // 間違ったパスワード
    await page.getByTestId('password-input').fill('WrongPassword');
    await page.getByTestId('login-button').click();

    // 期待結果: エラーメッセージが表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('メールアドレスまたはパスワードが正しくありません');

    // 期待結果: ログインページに留まる
    await expect(page).toHaveURL('/login');
  });

  /**
   * TC-014: UI - パスワード表示切り替え
   * 優先度: P2 (Medium)
   */
  test('TC-014: パスワードの表示/非表示を切り替えられる', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByTestId('password-input');
    const passwordToggle = page.getByTestId('password-toggle');

    // パスワードを入力
    await passwordInput.fill('Password123');

    // 初期状態: type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // トグルボタンをクリック
    await passwordToggle.click();

    // 期待結果: type="text"になり、パスワードが平文表示される
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // もう一度クリック
    await passwordToggle.click();

    // 期待結果: type="password"に戻る
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
