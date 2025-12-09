import { test, expect } from '@playwright/test';

/**
 * 記事機能のE2Eテスト
 * テスト設計書: docs/blog-test-design.md
 *
 * 注意: 記事テストはDBを共有するため、シリアル実行する
 */
test.describe.configure({ mode: 'serial' });

// 各テストの前にデータベースをクリーンアップし、テストユーザーを作成
test.beforeEach(async ({ page }) => {
  // データベースリセット
  await page.request.post('/api/test/reset-db');

  // テストユーザーを作成
  await page.request.post('/api/test/create-user', {
    data: {
      email: 'post-test@example.com',
      username: 'postuser',
      name: 'Post Test User',
      password: 'Password123',
    },
  });
});

// ログインヘルパー関数
async function loginAsTestUser(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('post-test@example.com');
  await page.getByTestId('password-input').fill('Password123');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/');
}

test.describe('記事投稿機能', () => {
  /**
   * TC-101: 正常系 - 有効な情報で記事を作成
   * 優先度: P0 (Critical)
   *
   * 前提条件: ログイン済み
   */
  test('TC-101: 有効な情報で記事を作成できる', async ({ page }) => {
    // ログイン
    await loginAsTestUser(page);

    // 前提条件: 新規記事作成ページにアクセス
    await page.goto('/posts/new');

    // テスト手順1: title-inputにタイトルを入力
    await page.getByTestId('title-input').fill('テスト記事のタイトル');

    // テスト手順2: content-editorに本文を入力
    await page.getByTestId('content-editor').fill('# 見出し\n\nこれはテスト記事です');

    // テスト手順3: publish-buttonをクリック
    await page.getByTestId('publish-button').click();

    // 期待結果1: 記事詳細ページにリダイレクトされる
    await expect(page).toHaveURL(/\/posts\/[a-z0-9]+/);

    // 期待結果2: 作成した記事の内容が表示される
    await expect(page.getByTestId('post-title')).toHaveText('テスト記事のタイトル');

    // 期待結果4: Markdownが正しくHTMLに変換されている
    const postContent = page.getByTestId('post-content');
    await expect(postContent.locator('h1')).toHaveText('見出し');
    await expect(postContent.locator('p')).toHaveText('これはテスト記事です');
  });

  /**
   * TC-102: 正常系 - 下書きとして保存
   * 優先度: P0 (Critical)
   */
  test('TC-102: 記事を下書きとして保存できる', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    await page.getByTestId('title-input').fill('下書き記事');
    await page.getByTestId('content-editor').fill('下書きの内容');

    // 下書き保存ボタンをクリック
    await page.getByTestId('save-draft-button').click();

    // 期待結果1: ダッシュボードにリダイレクトされる
    await expect(page).toHaveURL('/dashboard');

    // 期待結果2: ダッシュボードに下書きが表示される
    await expect(page.getByText('下書き記事')).toBeVisible();

    // 期待結果3: トップページ（公開記事一覧）には表示されない
    await page.goto('/');
    await expect(page.getByText('下書き記事')).not.toBeVisible();
  });

  /**
   * TC-103: 異常系 - タイトルが空
   * 優先度: P1 (High)
   */
  test('TC-103: タイトルが空の場合エラーが表示される', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    // タイトルを空のままにする
    await page.getByTestId('content-editor').fill('本文');
    await page.getByTestId('publish-button').click();

    // 期待結果: エラーメッセージが表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('タイトルを入力してください');

    // 期待結果: title-inputがフォーカスされる
    await expect(page.getByTestId('title-input')).toBeFocused();
  });

  /**
   * TC-105: 境界値 - タイトル最大文字数(100文字)
   * 優先度: P2 (Medium)
   */
  test('TC-105: タイトルが100文字の場合作成できる', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    // 100文字のタイトルを作成
    const title = 'あ'.repeat(100);
    await page.getByTestId('title-input').fill(title);
    await page.getByTestId('content-editor').fill('本文');
    await page.getByTestId('publish-button').click();

    // 期待結果: 記事詳細ページにリダイレクトされる
    await expect(page).toHaveURL(/\/posts\/[a-z0-9]+/);

    // 期待結果: タイトルが完全に保存される
    await expect(page.getByTestId('post-title')).toHaveText(title);
  });

  /**
   * TC-106: 境界値 - タイトル最大文字数超過(101文字)
   * 優先度: P2 (Medium)
   */
  test('TC-106: タイトルが101文字の場合エラーが表示される', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    // 101文字のタイトルを作成
    const title = 'あ'.repeat(101);
    await page.getByTestId('title-input').fill(title);
    await page.getByTestId('content-editor').fill('本文');
    await page.getByTestId('publish-button').click();

    // 期待結果: エラーメッセージが表示される
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('タイトルは100文字以内で入力してください');
  });

  /**
   * TC-108: 正常系 - アイキャッチ画像をアップロード
   * 優先度: P1 (High)
   * TODO: 画像アップロード機能実装後に有効化
   */
  test.skip('TC-108: アイキャッチ画像をアップロードできる', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    await page.getByTestId('title-input').fill('画像付き記事');
    await page.getByTestId('content-editor').fill('本文');

    // アイキャッチ画像をアップロード
    // TODO: テスト用の画像ファイルを用意してアップロード
    // const fileInput = page.getByTestId('cover-image-upload');
    // await fileInput.setInputFiles('path/to/test-image.jpg');

    await page.getByTestId('publish-button').click();

    // 期待結果: 記事が作成され、画像が表示される
    await expect(page.getByTestId('success-message')).toBeVisible();
    // await expect(page.getByTestId('post-cover-image')).toBeVisible();
  });

  /**
   * TC-111: 正常系 - タグを追加
   * 優先度: P1 (High)
   * TODO: タグ機能実装後に有効化
   */
  test.skip('TC-111: 記事にタグを追加できる', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/posts/new');

    await page.getByTestId('title-input').fill('タイトル');
    await page.getByTestId('content-editor').fill('本文');

    // タグを追加
    await page.getByTestId('tag-input').fill('React');
    await page.getByTestId('add-tag-button').click();

    await page.getByTestId('tag-input').fill('Next.js');
    await page.getByTestId('add-tag-button').click();

    await page.getByTestId('tag-input').fill('TypeScript');
    await page.getByTestId('add-tag-button').click();

    await page.getByTestId('publish-button').click();

    // 期待結果: 記事が作成され、タグが表示される
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('post-tag-react')).toBeVisible();
    await expect(page.getByTestId('post-tag-nextjs')).toBeVisible();
    await expect(page.getByTestId('post-tag-typescript')).toBeVisible();
  });
});

test.describe('記事編集・削除機能', () => {
  let testUserId: string;

  // 各テストの前にデータベースをクリーンアップし、テストユーザーを作成
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/test/reset-db');
    const userResponse = await page.request.post('/api/test/create-user', {
      data: {
        email: 'post-test@example.com',
        username: 'postuser',
        name: 'Post Test User',
        password: 'Password123',
      },
    });
    const userData = await userResponse.json();
    testUserId = userData.userId;
  });

  // テスト用の記事をAPI経由で作成するヘルパー関数
  async function createTestPostViaApi(page: import('@playwright/test').Page, title: string = 'テスト記事', content: string = 'テストの内容') {
    const response = await page.request.post('/api/test/create-post', {
      data: {
        title,
        content,
        authorId: testUserId,
        status: 'PUBLISHED',
      },
    });
    const data = await response.json();
    return data.post.id;
  }

  /**
   * TC-115: 正常系 - 自分の記事を編集
   * 優先度: P0 (Critical)
   */
  test('TC-115: 自分の記事を編集できる', async ({ page }) => {
    // API経由でテスト用記事を作成
    const postId = await createTestPostViaApi(page, '編集前のタイトル', '編集前の内容');

    // ログイン
    await loginAsTestUser(page);

    // 記事詳細ページにアクセス
    await page.goto(`/posts/${postId}`);

    // edit-buttonをクリック
    await page.getByTestId('edit-button').click();

    // 編集ページに遷移
    await expect(page).toHaveURL(`/posts/${postId}/edit`);

    // タイトルを変更
    await page.getByTestId('title-input').fill('編集後のタイトル');

    // 保存
    await page.getByTestId('save-button').click();

    // 期待結果: 記事詳細ページにリダイレクトされる
    await expect(page).toHaveURL(`/posts/${postId}`);

    // 期待結果: 変更が反映されている
    await expect(page.getByTestId('post-title')).toHaveText('編集後のタイトル');
  });

  /**
   * TC-117: 正常系 - 自分の記事を削除
   * 優先度: P0 (Critical)
   */
  test('TC-117: 自分の記事を削除できる', async ({ page }) => {
    // API経由でテスト用記事を作成
    const postId = await createTestPostViaApi(page, '削除する記事', '削除するテスト内容');

    // ログイン
    await loginAsTestUser(page);

    await page.goto(`/posts/${postId}`);

    // delete-buttonをクリック
    await page.getByTestId('delete-button').click();

    // 確認ダイアログでconfirm-delete-buttonをクリック
    await page.getByTestId('confirm-delete-button').click();

    // 期待結果: ダッシュボードにリダイレクトされる
    await expect(page).toHaveURL('/dashboard');
  });

  /**
   * TC-118: UI - 削除確認ダイアログ
   * 優先度: P1 (High)
   */
  test('TC-118: 削除確認ダイアログでキャンセルできる', async ({ page }) => {
    // API経由でテスト用記事を作成
    const postId = await createTestPostViaApi(page, 'キャンセルテスト記事', 'キャンセルテスト内容');

    // ログイン
    await loginAsTestUser(page);

    await page.goto(`/posts/${postId}`);

    await page.getByTestId('delete-button').click();

    // キャンセルボタンをクリック
    await page.getByTestId('cancel-delete-button').click();

    // 期待結果: ダイアログが閉じる
    await expect(page.getByTestId('confirm-delete-button')).not.toBeVisible();

    // 期待結果: 記事詳細ページに留まる
    await expect(page).toHaveURL(`/posts/${postId}`);
  });
});

test.describe('記事閲覧機能', () => {
  /**
   * TC-120: 正常系 - 公開記事一覧を表示
   * 優先度: P0 (Critical)
   */
  test('TC-120: 公開記事一覧が表示される', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // 期待結果: post-listに記事カードが表示される
    const postList = page.getByTestId('post-list');
    await expect(postList).toBeVisible();

    // 期待結果: 記事カードに必要な要素が含まれる
    // (記事が存在する場合)
    const firstPost = page.getByTestId('post-card-1');
    if (await firstPost.isVisible()) {
      await expect(page.getByTestId('post-title-1')).toBeVisible();
      await expect(page.getByTestId('post-excerpt-1')).toBeVisible();
      await expect(page.getByTestId('post-author-1')).toBeVisible();
      await expect(page.getByTestId('post-date-1')).toBeVisible();
    }
  });

  /**
   * TC-122: 正常系 - 記事詳細を表示
   * 優先度: P0 (Critical)
   * TODO: テストデータセットアップ後に有効化
   */
  test.skip('TC-122: 記事詳細が表示される', async ({ page }) => {
    // 記事詳細ページにアクセス
    await page.goto('/posts/test-post-id');

    // 期待結果: post-detail-pageが表示される
    await expect(page.getByTestId('post-detail-page')).toBeVisible();

    // 期待結果: タイトル、本文、著者、日時が表示される
    await expect(page.getByTestId('post-title')).toBeVisible();
    await expect(page.getByTestId('post-content')).toBeVisible();
    await expect(page.getByTestId('post-author')).toBeVisible();
    await expect(page.getByTestId('post-date')).toBeVisible();
  });
});
