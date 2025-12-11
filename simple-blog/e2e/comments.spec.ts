import { test, expect } from '@playwright/test';

/**
 * コメント機能のE2Eテスト
 * テスト設計書: docs/blog-test-design.md
 *
 * 注意: コメントテストはDBを共有するため、シリアル実行する
 */
test.describe.configure({ mode: 'serial' });

// テスト用のユーザー情報
let testUserId: string;
let testPostId: string;

// 各テストの前にデータベースをクリーンアップし、テストデータを作成
test.beforeEach(async ({ page }) => {
  // データベースリセット
  await page.request.post('/api/test/reset-db');

  // テストユーザーを作成
  const userResponse = await page.request.post('/api/test/create-user', {
    data: {
      email: 'comment-test@example.com',
      username: 'commentuser',
      name: 'Comment Test User',
      password: 'Password123',
    },
  });
  const userData = await userResponse.json();
  testUserId = userData.userId;

  // テスト用公開記事を作成
  const postResponse = await page.request.post('/api/test/create-post', {
    data: {
      title: 'コメントテスト用記事',
      content: 'これはコメントテスト用の本文です。',
      authorId: testUserId,
      status: 'PUBLISHED',
    },
  });
  const postData = await postResponse.json();
  testPostId = postData.post.id;
});

// ログインヘルパー関数
async function loginAsTestUser(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('comment-test@example.com');
  await page.getByTestId('password-input').fill('Password123');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/');
}

test.describe('コメント機能', () => {
  /**
   * TC-201: 正常系 - 記事にコメントを投稿
   * 優先度: P0 (Critical)
   *
   * 前提条件: ログイン済み、記事詳細ページにアクセス済み
   */
  test('TC-201: 記事にコメントを投稿できる', async ({ page }) => {
    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // テスト手順1: comment-inputにコメントを入力
    await page.getByTestId('comment-input').fill('素晴らしい記事ですね!');

    // テスト手順2: comment-submit-buttonをクリック
    await page.getByTestId('comment-submit-button').click();

    // 期待結果1: comment-listにコメントが追加表示される
    const commentList = page.getByTestId('comment-list');
    await expect(commentList).toBeVisible();
    await expect(commentList).toContainText('素晴らしい記事ですね!');

    // 期待結果2: comment-inputがクリアされる
    await expect(page.getByTestId('comment-input')).toHaveValue('');

    // 期待結果3: コメント投稿者名が表示される
    await expect(commentList).toContainText('Comment Test User');
  });

  /**
   * TC-202: 異常系 - コメントが空
   * 優先度: P1 (High)
   */
  test('TC-202: 空のコメントを投稿しようとするとエラーが表示される', async ({ page }) => {
    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // テスト手順1: comment-inputを空のままにする
    // テスト手順2: comment-submit-buttonをクリック
    await page.getByTestId('comment-submit-button').click();

    // 期待結果: error-messageに「コメントを入力してください」が表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('コメントを入力してください');
  });

  /**
   * TC-203: 境界値 - コメント最大文字数(1,000文字)
   * 優先度: P2 (Medium)
   */
  test('TC-203: 1000文字のコメントを投稿できる', async ({ page }) => {
    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // 1000文字のコメントを作成
    const longComment = 'あ'.repeat(1000);
    await page.getByTestId('comment-input').fill(longComment);
    await page.getByTestId('comment-submit-button').click();

    // 期待結果: コメントが投稿される
    const commentList = page.getByTestId('comment-list');
    await expect(commentList).toContainText(longComment.substring(0, 50)); // 最初の50文字で確認
  });

  /**
   * TC-204: 境界値 - コメント最大文字数超過(1,001文字)
   * 優先度: P2 (Medium)
   */
  test('TC-204: 1001文字のコメントを投稿しようとするとエラーが表示される', async ({ page }) => {
    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // 1001文字のコメントを作成
    const longComment = 'あ'.repeat(1001);
    await page.getByTestId('comment-input').fill(longComment);
    await page.getByTestId('comment-submit-button').click();

    // 期待結果: error-messageに「コメントは1,000文字以内で入力してください」が表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('コメントは1,000文字以内で入力してください');
  });

  /**
   * TC-205: 権限 - 未ログインでコメント投稿を試みる
   * 優先度: P1 (High)
   *
   * 前提条件: ログアウト状態
   */
  test('TC-205: 未ログインユーザーにはコメントフォームが表示されない', async ({ page }) => {
    // ログインせずに記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // 期待結果1: comment-formが表示されない
    await expect(page.getByTestId('comment-form')).not.toBeVisible();

    // 期待結果2: 「コメントするにはログインしてください」メッセージが表示される
    await expect(page.getByText('コメントするにはログインしてください')).toBeVisible();

    // 期待結果3: login-prompt-buttonが表示される
    await expect(page.getByTestId('login-prompt-button')).toBeVisible();
  });

  /**
   * TC-206: 正常系 - 自分のコメントを削除
   * 優先度: P1 (High)
   *
   * 前提条件: ログイン済み、自分のコメントが存在する
   */
  test('TC-206: 自分のコメントを削除できる', async ({ page }) => {
    // API経由でテスト用コメントを作成
    await page.request.post('/api/test/create-comment', {
      data: {
        content: '削除するコメント',
        postId: testPostId,
        authorId: testUserId,
      },
    });

    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // コメントが表示されていることを確認
    await expect(page.getByText('削除するコメント')).toBeVisible();

    // テスト手順1: 自分のコメントの削除ボタンをクリック
    // コメントリスト内の削除ボタンを取得
    const commentList = page.getByTestId('comment-list');
    const deleteButton = commentList.locator('button:has-text("削除")').first();
    await deleteButton.click();

    // テスト手順2: 確認ダイアログでconfirm-delete-comment-buttonをクリック
    await page.getByTestId('confirm-delete-comment-button').click();

    // 期待結果1: コメントが削除される
    await expect(page.getByText('削除するコメント')).not.toBeVisible();
  });

  /**
   * TC-207: 権限 - 他人のコメントに削除ボタンが表示されない
   * 優先度: P1 (High)
   */
  test('TC-207: 他人のコメントには削除ボタンが表示されない', async ({ page }) => {
    // 別のユーザーを作成
    const otherUserResponse = await page.request.post('/api/test/create-user', {
      data: {
        email: 'other-user@example.com',
        username: 'otheruser',
        name: 'Other User',
        password: 'Password123',
      },
    });
    const otherUserData = await otherUserResponse.json();

    // 別のユーザーのコメントを作成
    const commentResponse = await page.request.post('/api/test/create-comment', {
      data: {
        content: '他のユーザーのコメント',
        postId: testPostId,
        authorId: otherUserData.userId,
      },
    });
    const commentData = await commentResponse.json();
    const otherCommentId = commentData.comment.id;

    // テストユーザーでログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${testPostId}`);

    // 他人のコメントが表示されていることを確認
    await expect(page.getByText('他のユーザーのコメント')).toBeVisible();

    // 期待結果: 他人のコメントには削除ボタンが表示されない
    const deleteButton = page.getByTestId(`delete-comment-button-${otherCommentId}`);
    await expect(deleteButton).not.toBeVisible();
  });
});
