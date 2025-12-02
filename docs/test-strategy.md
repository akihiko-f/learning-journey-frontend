# テスト戦略書

## 概要

このドキュメントでは、TDD（テスト駆動開発）とATDD（受け入れテスト駆動開発）を組み合わせたテスト戦略とテスト計画を定義します。

---

## テスト駆動開発アプローチ

### TDD（Test-Driven Development）

テストを先に書いてから実装するアプローチ。

#### TDDサイクル: Red-Green-Refactor

```
1. Red（失敗するテストを書く）
   ↓
2. Green（最小限の実装でテストを通す）
   ↓
3. Refactor（コードをリファクタリング）
   ↓
   繰り返す
```

#### TDDのメリット

- ✅ バグの早期発見
- ✅ 設計の改善（テスタブルなコードになる）
- ✅ リファクタリングが安全
- ✅ ドキュメント代わりになる
- ✅ 実装のゴールが明確

---

### ATDD（Acceptance Test-Driven Development）

ユーザーの受け入れ基準をテストで表現してから実装するアプローチ。

#### ATDDサイクル

```
1. ユーザーストーリーから受け入れ基準を定義
   ↓
2. 受け入れテスト（E2Eテスト）を書く（失敗する）
   ↓
3. TDDで機能を実装
   ↓
4. 受け入れテストが通ることを確認
```

---

## TDD + ATDD 統合フロー（一人開発版）

### 開発ステップ

```
Step 1: 要件定義
   ↓
Step 2: UI設計とロケーター決定（実装前）
   ↓
Step 3: ATDDテスト作成（E2Eテスト - Red）
   ↓
Step 4: TDDで実装
   - 単体テスト（Red → Green → Refactor）
   - 統合テスト（Red → Green → Refactor）
   ↓
Step 5: ATDDテストが通ることを確認（Green）
   ↓
Step 6: リファクタリング
```

### 実例: 投稿作成機能

#### Step 1: ユーザーストーリー

```markdown
As a ユーザー
I want 投稿を作成したい
So that 自分の考えを共有できる

受け入れ基準:
- [ ] タイトルと本文を入力できる
- [ ] 「公開」ボタンをクリックすると投稿が作成される
- [ ] 作成後に投稿詳細ページが表示される
- [ ] タイトルが空の場合はエラーメッセージが表示される
```

#### Step 2: UI設計とロケーター決定

**UI設計**: `docs/ui-design.md`の投稿作成ページを参照

**ロケーター一覧**:
- `post-create-form`: フォーム全体
- `post-title-input`: タイトル入力
- `post-content-input`: 本文入力
- `post-submit-button`: 公開ボタン
- `success-message`: 成功メッセージ
- `error-message`: エラーメッセージ

#### Step 3: ATDDテスト作成（E2Eテスト）

```typescript
// tests/e2e/post-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('投稿作成機能', () => {
  test('ユーザーが投稿を作成できる', async ({ page }) => {
    // 前提条件: ログイン済み
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'user@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // 投稿作成ページに移動
    await page.goto('/posts/new')

    // タイトルと本文を入力
    await page.fill('[data-testid="post-title-input"]', 'テスト投稿')
    await page.fill('[data-testid="post-content-input"]', 'これはテスト投稿です。')

    // 公開ボタンをクリック
    await page.click('[data-testid="post-submit-button"]')

    // 成功メッセージが表示される
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('投稿を作成しました')

    // 投稿詳細ページにリダイレクトされる
    await expect(page).toHaveURL(/\/posts\/\d+/)

    // 作成した投稿が表示される
    await expect(page.locator('[data-testid="post-detail-title"]'))
      .toContainText('テスト投稿')
  })

  test('タイトルが空の場合はエラーが表示される', async ({ page }) => {
    await page.goto('/posts/new')

    // タイトルを空のまま送信
    await page.fill('[data-testid="post-content-input"]', '本文のみ')
    await page.click('[data-testid="post-submit-button"]')

    // エラーメッセージが表示される
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('タイトルを入力してください')

    // ページ遷移しない
    await expect(page).toHaveURL('/posts/new')
  })
})
```

**実行**: テストは失敗する（Red） ← これが正しい！

#### Step 4-1: バリデーション関数のTDD

```typescript
// lib/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validatePost } from './validation'

describe('validatePost', () => {
  // Red: 失敗するテストを書く
  it('タイトルが空の場合はエラーを返す', () => {
    const result = validatePost({ title: '', content: '本文' })
    expect(result.success).toBe(false)
    expect(result.errors.title).toBe('タイトルを入力してください')
  })

  it('本文が空の場合はエラーを返す', () => {
    const result = validatePost({ title: 'タイトル', content: '' })
    expect(result.success).toBe(false)
    expect(result.errors.content).toBe('本文を入力してください')
  })

  it('有効な入力の場合は成功を返す', () => {
    const result = validatePost({ title: 'タイトル', content: '本文' })
    expect(result.success).toBe(true)
  })
})
```

**実装**（Green）:

```typescript
// lib/validation.ts
export function validatePost(data: { title: string; content: string }) {
  const errors: Record<string, string> = {}

  if (!data.title.trim()) {
    errors.title = 'タイトルを入力してください'
  }

  if (!data.content.trim()) {
    errors.content = '本文を入力してください'
  }

  return {
    success: Object.keys(errors).length === 0,
    errors
  }
}
```

#### Step 4-2: コンポーネントのTDD

```typescript
// components/PostForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PostForm from './PostForm'

describe('PostForm', () => {
  it('タイトルと本文の入力欄が表示される', () => {
    render(<PostForm onSubmit={vi.fn()} />)

    expect(screen.getByTestId('post-title-input')).toBeInTheDocument()
    expect(screen.getByTestId('post-content-input')).toBeInTheDocument()
    expect(screen.getByTestId('post-submit-button')).toBeInTheDocument()
  })

  it('タイトルが空の場合はエラーメッセージが表示される', async () => {
    render(<PostForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByTestId('post-submit-button'))

    expect(screen.getByTestId('error-message'))
      .toHaveTextContent('タイトルを入力してください')
  })
})
```

**実装**: `components/PostForm.tsx`を作成

#### Step 4-3: API エンドポイントのTDD

```typescript
// app/api/posts/route.test.ts
import { describe, it, expect } from 'vitest'
import { POST } from './route'

describe('POST /api/posts', () => {
  it('有効なデータで投稿が作成される', async () => {
    const request = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'テスト投稿',
        content: 'テスト本文'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.data.post.title).toBe('テスト投稿')
  })
})
```

**実装**: `app/api/posts/route.ts`を作成

#### Step 5: ATDDテストの確認

すべての実装が完了したら、Step 3で書いたE2Eテストを実行:

```bash
npm run test:e2e
```

**テストが通れば（Green）、機能完成！** ✅

---

## テストレベルと戦略

### 1. 単体テスト（Unit Test）

#### 目的
個々の関数・コンポーネントの動作確認

#### 対象
- ユーティリティ関数
- バリデーション関数
- カスタムフック
- Reactコンポーネント（単体）

#### ツール
- **テストフレームワーク**: Vitest
- **UIテスト**: React Testing Library

#### カバレッジ目標
80%以上

#### 実施タイミング
コード実装時（継続的）

#### 例
```typescript
// ユーティリティ関数のテスト
describe('formatDate', () => {
  it('ISO形式を読みやすい形式に変換する', () => {
    const result = formatDate('2024-01-01T00:00:00Z')
    expect(result).toBe('2024年1月1日')
  })
})

// Reactコンポーネントのテスト
describe('Button', () => {
  it('クリックするとonClickが呼ばれる', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>クリック</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

---

### 2. 統合テスト（Integration Test）

#### 目的
複数のコンポーネント・モジュール間の連携確認

#### 対象
- APIエンドポイント
- データベース操作
- コンポーネント間のデータフロー

#### ツール
- Vitest
- React Testing Library
- MSW（モックサーバー）

#### 実施タイミング
機能実装完了時

#### 例
```typescript
// API統合テスト
describe('POST /api/posts', () => {
  it('投稿を作成しデータベースに保存する', async () => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'テスト',
        content: '本文'
      })
    })

    expect(response.status).toBe(201)

    // データベースに保存されたか確認
    const post = await db.post.findFirst({
      where: { title: 'テスト' }
    })
    expect(post).toBeDefined()
  })
})
```

---

### 3. E2Eテスト（End-to-End Test）

#### 目的
ユーザーの実際の操作フローを確認（ATDD）

#### 対象
- ユーザー登録〜ログインフロー
- 投稿作成〜公開フロー
- 主要なユーザーストーリー

#### ツール
- **Playwright** または **Cypress**

#### 実施タイミング
機能完成時・リリース前

#### カバレッジ目標
主要なユーザーストーリーをすべてカバー

#### 例
```typescript
test('ユーザーがログインして投稿を作成できる', async ({ page }) => {
  // ログイン
  await page.goto('/login')
  await page.fill('[data-testid="email-input"]', 'user@example.com')
  await page.fill('[data-testid="password-input"]', 'password')
  await page.click('[data-testid="login-button"]')

  // ダッシュボードに遷移
  await expect(page).toHaveURL('/dashboard')

  // 投稿作成
  await page.goto('/posts/new')
  await page.fill('[data-testid="post-title-input"]', 'タイトル')
  await page.fill('[data-testid="post-content-input"]', '本文')
  await page.click('[data-testid="post-submit-button"]')

  // 投稿が作成された
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

---

### 4. パフォーマンステスト

#### 目的
システムの性能・負荷耐性確認

#### 確認項目
- ページ読み込み時間（目標: 3秒以内）
- APIレスポンス時間（目標: 500ms以内）
- Lighthouseスコア（目標: 90以上）

#### ツール
- Lighthouse
- k6
- WebPageTest

#### 実施タイミング
リリース前

---

### 5. セキュリティテスト

#### 目的
セキュリティ脆弱性の検出

#### 確認項目
- SQL Injection対策
- XSS対策
- CSRF対策
- 認証・認可の実装

#### ツール
- OWASP ZAP
- Snyk

#### 実施タイミング
リリース前

---

## テスト自動化戦略

### CI/CDパイプライン

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run integration tests
        run: npm run test:integration

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Install Playwright
        run: npx playwright install
      - name: Run E2E tests
        run: npm run test:e2e
```

### 自動化する対象

✅ **自動化する**:
- 単体テスト: 100%
- 統合テスト: 主要なAPIエンドポイント
- E2Eテスト: クリティカルなユーザーフロー
- リグレッションテスト: 過去のバグ修正箇所

❌ **自動化しない**:
- UI/UXの視覚的な確認
- 一度きりのテスト
- 頻繁に変更される機能（安定してから自動化）

---

## テストスケジュール

### 開発フロー

```
機能開発開始
   ↓
Step 1: ユーザーストーリー作成（1時間）
   ↓
Step 2: UI設計 + ロケーター決定（1時間）
   ↓
Step 3: ATDDテスト作成（E2E）（1時間）
   ↓
Step 4: TDD実装
   - バリデーション関数（1時間）
   - コンポーネント（2時間）
   - API（1時間）
   ↓
Step 5: ATDDテスト確認（30分）
   ↓
Step 6: リファクタリング（1時間）
   ↓
機能完成（合計: 8.5時間）
```

---

## 合格基準（Exit Criteria）

### 必須条件

- [ ] すべてのP0、P1のテストケースが合格
- [ ] 単体テストのカバレッジが80%以上
- [ ] 致命的なバグ（Critical/Blocker）が0件
- [ ] 重大なバグ（Major）が0件
- [ ] E2Eテストがすべて通る
- [ ] パフォーマンス要件を満たしている
- [ ] セキュリティ脆弱性（High以上）が0件

### 推奨条件

- [ ] P2のテストケースが90%以上合格
- [ ] 軽微なバグ（Minor）が5件以下
- [ ] ドキュメントが最新状態
- [ ] アクセシビリティテスト合格（WCAG 2.1 AA）

---

## バグ管理

### バグの重要度

| レベル | 説明 | 対応期限 |
|--------|------|---------|
| Blocker | システムが使用不可 | 即時対応 |
| Critical | 主要機能が動作しない | 24時間以内 |
| Major | 重要な機能に問題 | 3日以内 |
| Minor | 軽微な問題 | 次のスプリント |
| Trivial | 些細な問題 | 優先度低 |

### バグレポートフォーマット

```markdown
## バグタイトル
[簡潔な説明]

## 環境
- ブラウザ: Chrome 120
- OS: macOS 14

## 再現手順
1. ログインする
2. 投稿作成ページに移動
3. タイトルを入力せずに送信

## 期待される動作
エラーメッセージが表示される

## 実際の動作
エラーメッセージが表示されず、空の投稿が作成される

## 重要度
Major

## スクリーンショット
[添付]
```

---

## 参考資料

- [UI設計書（ロケーター含む）](./ui-design.md)
- [テスト設計書](./test-design.md)
- [要件定義書](./requirements.md)
- [API設計書](./api-design.md)

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| YYYY/MM/DD | 1.0 | 初版作成 | [名前] |
