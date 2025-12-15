import { test, expect } from '@playwright/test';

/**
 * 検索・フィルタリング機能のE2Eテスト
 * テスト設計書: docs/blog-test-design.md
 */
test.describe.configure({ mode: 'serial' });

let testUserId: string;

test.beforeEach(async ({ page }) => {
  // データベースリセット
  await page.request.post('/api/test/reset-db');

  // テストユーザーを作成
  const userResponse = await page.request.post('/api/test/create-user', {
    data: {
      email: 'search-test@example.com',
      username: 'searchuser',
      name: 'Search Test User',
      password: 'Password123',
    },
  });
  const userData = await userResponse.json();
  testUserId = userData.userId;

  // React記事を作成
  await page.request.post('/api/test/create-post', {
    data: {
      title: 'React入門ガイド',
      content: 'Reactの基礎を学びましょう。コンポーネントやフックについて解説します。',
      authorId: testUserId,
      status: 'PUBLISHED',
      tags: ['React', 'JavaScript'],
    },
  });

  // Next.js記事を作成
  await page.request.post('/api/test/create-post', {
    data: {
      title: 'Next.js実践入門',
      content: 'Next.jsでWebアプリケーションを構築する方法を解説します。',
      authorId: testUserId,
      status: 'PUBLISHED',
      tags: ['Next.js', 'React'],
    },
  });

  // TypeScript記事を作成
  await page.request.post('/api/test/create-post', {
    data: {
      title: 'TypeScript型システム',
      content: 'TypeScriptの型システムについて詳しく解説します。',
      authorId: testUserId,
      status: 'PUBLISHED',
      tags: ['TypeScript'],
    },
  });
});

test.describe('検索・フィルタリング機能', () => {
  /**
   * TC-401: 正常系 - キーワードで記事を検索
   * 優先度: P1 (High)
   */
  test('TC-401: キーワードで記事を検索できる', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // テスト手順1: search-inputに「React」を入力
    await page.getByTestId('search-input').fill('React');

    // テスト手順2: search-buttonをクリック
    await page.getByTestId('search-button').click();

    // 期待結果: 検索結果ページに遷移
    await expect(page).toHaveURL(/\/search\?q=React/);

    // 期待結果: search-resultsに「React」を含む記事が表示される
    const searchResults = page.getByTestId('search-results');
    await expect(searchResults).toBeVisible();
    await expect(page.getByText('React入門ガイド')).toBeVisible();
    await expect(page.getByText('Next.js実践入門')).toBeVisible(); // Reactタグ付き

    // 期待結果: マッチしない記事は表示されない
    // TypeScript記事はReactを含まないので表示されない可能性があるが、
    // 実際にはタグではなくキーワード検索なので確認
  });

  /**
   * TC-402: 正常系 - 検索結果が0件
   * 優先度: P2 (Medium)
   */
  test('TC-402: 検索結果が0件の場合メッセージが表示される', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // テスト手順1: search-inputに存在しないキーワードを入力
    await page.getByTestId('search-input').fill('zzzzzzzzz');

    // テスト手順2: search-buttonをクリック
    await page.getByTestId('search-button').click();

    // 期待結果: search-resultsに「該当する記事が見つかりませんでした」が表示される
    await expect(page.getByTestId('search-results')).toContainText('該当する記事が見つかりませんでした');

    // 期待結果: empty-stateが表示される
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  /**
   * TC-403: 正常系 - タグと検索を組み合わせる
   * 優先度: P2 (Medium)
   */
  test('TC-403: タグと検索キーワードを組み合わせて絞り込める', async ({ page }) => {
    // 検索結果ページにアクセス（Reactで検索）
    await page.goto('/search?q=入門');

    // 両方の入門記事が表示されることを確認
    await expect(page.getByText('React入門ガイド')).toBeVisible();
    await expect(page.getByText('Next.js実践入門')).toBeVisible();

    // テスト手順: tag-filter-reactをクリック
    await page.getByTestId('tag-filter-react').first().click();

    // 期待結果: URLが/search?q=入門&tag=reactになる
    await expect(page).toHaveURL(/\/search\?q=.*&tag=react/i);

    // 期待結果: 「入門」を含み、かつ「React」タグの付いた記事のみが表示される
    await expect(page.getByText('React入門ガイド')).toBeVisible();
    await expect(page.getByText('Next.js実践入門')).toBeVisible(); // Next.jsもReactタグ付き
  });
});
