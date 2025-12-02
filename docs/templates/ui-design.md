# UI設計書

## 概要

このドキュメントでは、アプリケーションの画面設計とテストロケーター（data-testid）を統合管理します。

**重要**: 実装前にこのドキュメントで画面設計とロケーターを決定します。

---

## UI設計の原則

### デザインシステム

#### カラーパレット
```css
/* プライマリーカラー */
--primary: #667eea;
--primary-dark: #5a67d8;
--primary-light: #7f9cf5;

/* セカンダリーカラー */
--secondary: #48bb78;
--secondary-dark: #38a169;

/* グレースケール */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-500: #6b7280;
--gray-900: #111827;

/* セマンティックカラー */
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

#### タイポグラフィ
```css
/* 見出し */
h1: 2.5rem (40px) - font-weight: 700
h2: 2rem (32px) - font-weight: 700
h3: 1.5rem (24px) - font-weight: 600

/* 本文 */
body: 1rem (16px) - font-weight: 400
small: 0.875rem (14px) - font-weight: 400
```

#### スペーシング
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

---

## ロケーター命名規則

### 基本フォーマット
```
[機能名]-[要素タイプ]-[アクション/状態]
```

### 例
```html
<!-- ✅ 良い例 -->
<input data-testid="post-title-input" />
<button data-testid="post-submit-button">公開</button>
<div data-testid="error-message">エラー</div>

<!-- ❌ 悪い例 -->
<input data-testid="input1" />
<button data-testid="btn">公開</button>
```

---

## 画面一覧と設計

### 1. ログインページ (`/login`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────┐
│          ロゴ                        │
│                                     │
│     ログイン                         │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ メールアドレス              │  │
│  │ [email-input]              │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ パスワード                  │  │
│  │ [password-input]      [👁]  │  │
│  └─────────────────────────────┘  │
│                                     │
│  [login-button: ログイン]           │
│                                     │
│  パスワードをお忘れですか？          │
│  [forgot-password-link]             │
│                                     │
│  アカウントをお持ちでない方          │
│  [signup-link: 新規登録]            │
└─────────────────────────────────────┘
```

#### HTML構造
```tsx
<div data-testid="login-page">
  <div data-testid="login-logo">
    <img src="/logo.svg" alt="ロゴ" />
  </div>

  <h1>ログイン</h1>

  {/* エラーメッセージ */}
  {error && (
    <div data-testid="login-error-message" role="alert">
      {error}
    </div>
  )}

  <form data-testid="login-form" onSubmit={handleSubmit}>
    {/* メールアドレス */}
    <div>
      <label htmlFor="email">メールアドレス</label>
      <input
        id="email"
        data-testid="email-input"
        type="email"
        placeholder="user@example.com"
        aria-required="true"
      />
    </div>

    {/* パスワード */}
    <div>
      <label htmlFor="password">パスワード</label>
      <div style={{ position: 'relative' }}>
        <input
          id="password"
          data-testid="password-input"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          aria-required="true"
        />
        <button
          data-testid="password-toggle"
          type="button"
          aria-label="パスワードを表示"
        >
          👁
        </button>
      </div>
    </div>

    {/* ログインボタン */}
    <button
      data-testid="login-button"
      type="submit"
      aria-busy={loading}
    >
      {loading ? 'ログイン中...' : 'ログイン'}
    </button>
  </form>

  {/* パスワード忘れ */}
  <a
    data-testid="forgot-password-link"
    href="/forgot-password"
  >
    パスワードをお忘れですか？
  </a>

  {/* 新規登録リンク */}
  <p>
    アカウントをお持ちでない方
    <a data-testid="signup-link" href="/signup">
      新規登録
    </a>
  </p>
</div>
```

#### ロケーター一覧

| 要素 | data-testid | 説明 | aria属性 |
|------|-------------|------|---------|
| ページ全体 | login-page | ログインページコンテナ | - |
| ロゴ | login-logo | ロゴ表示エリア | - |
| フォーム | login-form | ログインフォーム | - |
| メール入力 | email-input | メールアドレス入力欄 | aria-required="true" |
| パスワード入力 | password-input | パスワード入力欄 | aria-required="true" |
| パスワード表示 | password-toggle | パスワード表示/非表示 | aria-label="パスワードを表示" |
| ログインボタン | login-button | ログインボタン | aria-busy={loading} |
| エラーメッセージ | login-error-message | エラーメッセージ表示 | role="alert" |
| パスワード忘れ | forgot-password-link | パスワードリセットリンク | - |
| 新規登録リンク | signup-link | 新規登録ページリンク | - |

---

### 2. 新規登録ページ (`/signup`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────┐
│     新規登録                         │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ 名前                        │  │
│  │ [signup-name-input]        │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ メールアドレス              │  │
│  │ [signup-email-input]       │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ パスワード（8文字以上）     │  │
│  │ [signup-password-input]    │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ パスワード確認              │  │
│  │ [signup-password-confirm]  │  │
│  └─────────────────────────────┘  │
│                                     │
│  ☑ [terms-checkbox]                │
│  利用規約に同意する                 │
│                                     │
│  [signup-button: 登録]              │
│                                     │
│  既にアカウントをお持ちの方          │
│  [login-link: ログイン]             │
└─────────────────────────────────────┘
```

#### ロケーター一覧

| 要素 | data-testid | 説明 | aria属性 |
|------|-------------|------|---------|
| フォーム | signup-form | 新規登録フォーム | - |
| 名前入力 | signup-name-input | 名前入力欄 | aria-required="true" |
| メール入力 | signup-email-input | メールアドレス入力欄 | aria-required="true" |
| パスワード入力 | signup-password-input | パスワード入力欄 | aria-required="true" |
| パスワード確認 | signup-password-confirm-input | パスワード確認入力欄 | aria-required="true" |
| 利用規約チェック | terms-checkbox | 利用規約同意チェックボックス | aria-required="true" |
| 登録ボタン | signup-button | 登録ボタン | aria-busy={loading} |
| エラーメッセージ | signup-error-message | エラーメッセージ表示 | role="alert" |
| ログインリンク | login-link | ログインページリンク | - |

---

### 3. 投稿一覧ページ (`/posts`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────┐
│  ヘッダー [header-nav]                       │
├─────────────────────────────────────────────┤
│                                             │
│  投稿一覧                                    │
│                                             │
│  [post-search-input: 🔍 検索]               │
│  [post-filter-dropdown: 最新 ▼]             │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ [post-card-1]                      │    │
│  │  タイトル [post-title-1]           │    │
│  │  本文プレビュー [post-excerpt-1]   │    │
│  │  👤 投稿者 [post-author-1]         │    │
│  │  📅 2024/01/01 [post-date-1]       │    │
│  │  ❤️ 10 [post-likes-1]              │    │
│  │  💬 5 [post-comments-1]            │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ [post-card-2]                      │    │
│  │  ...                               │    │
│  └────────────────────────────────────┘    │
│                                             │
│  [load-more-button: もっと見る]             │
│                                             │
│  [pagination]                               │
│   [◀ prev] [1] [2] [3] [next ▶]            │
└─────────────────────────────────────────────┘
```

#### ロケーター一覧

| 要素 | data-testid | 説明 |
|------|-------------|------|
| 投稿リスト | post-list | 投稿一覧コンテナ |
| 検索入力 | post-search-input | 投稿検索入力欄 |
| フィルター | post-filter-dropdown | フィルタードロップダウン |
| 投稿カード | post-card-{id} | 投稿カード（動的ID） |
| 投稿タイトル | post-title-{id} | 投稿タイトル |
| 投稿本文 | post-excerpt-{id} | 本文プレビュー |
| 投稿者名 | post-author-{id} | 投稿者名 |
| 投稿日時 | post-date-{id} | 投稿日時 |
| いいね数 | post-likes-{id} | いいね数 |
| コメント数 | post-comments-{id} | コメント数 |
| もっと見る | load-more-button | さらに読み込むボタン |
| ページネーション | pagination | ページネーション全体 |
| 前へ | pagination-prev | 前のページボタン |
| 次へ | pagination-next | 次のページボタン |

---

### 4. 投稿作成ページ (`/posts/new`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────┐
│  新しい投稿を作成                            │
│                                             │
│  [post-create-form]                         │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ タイトル                            │  │
│  │ [post-title-input]                  │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 本文                                │  │
│  │ [post-content-input]                │  │
│  │                                     │  │
│  │                                     │  │
│  │                                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  タグ: [post-tags-input]                    │
│                                             │
│  📷 [post-image-upload: 画像をアップロード]  │
│                                             │
│  [post-draft-button: 下書き保存]            │
│  [post-preview-button: プレビュー]          │
│  [post-submit-button: 公開]                 │
│                                             │
│  [success-message] または [error-message]   │
└─────────────────────────────────────────────┘
```

#### HTML構造
```tsx
<div data-testid="post-create-page">
  <h1>新しい投稿を作成</h1>

  {/* 成功/エラーメッセージ */}
  {message && (
    <div
      data-testid={message.type === 'success' ? 'success-message' : 'error-message'}
      role="alert"
    >
      {message.text}
    </div>
  )}

  <form data-testid="post-create-form" onSubmit={handleSubmit}>
    {/* タイトル */}
    <div>
      <label htmlFor="title">タイトル</label>
      <input
        id="title"
        data-testid="post-title-input"
        type="text"
        placeholder="タイトルを入力"
        maxLength={200}
        aria-required="true"
      />
    </div>

    {/* 本文 */}
    <div>
      <label htmlFor="content">本文</label>
      <textarea
        id="content"
        data-testid="post-content-input"
        placeholder="本文を入力"
        rows={10}
        aria-required="true"
      />
    </div>

    {/* タグ */}
    <div>
      <label htmlFor="tags">タグ</label>
      <input
        id="tags"
        data-testid="post-tags-input"
        type="text"
        placeholder="タグをカンマ区切りで入力"
      />
    </div>

    {/* 画像アップロード */}
    <div>
      <label htmlFor="image">画像</label>
      <input
        id="image"
        data-testid="post-image-upload"
        type="file"
        accept="image/*"
      />
    </div>

    {/* ボタン群 */}
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button
        data-testid="post-draft-button"
        type="button"
        onClick={saveDraft}
      >
        下書き保存
      </button>

      <button
        data-testid="post-preview-button"
        type="button"
        onClick={showPreview}
      >
        プレビュー
      </button>

      <button
        data-testid="post-submit-button"
        type="submit"
        aria-busy={loading}
      >
        公開
      </button>
    </div>
  </form>
</div>
```

#### ロケーター一覧

| 要素 | data-testid | 説明 | aria属性 |
|------|-------------|------|---------|
| ページ | post-create-page | 投稿作成ページ全体 | - |
| フォーム | post-create-form | 投稿作成フォーム | - |
| タイトル入力 | post-title-input | タイトル入力欄 | aria-required="true", maxLength="200" |
| 本文入力 | post-content-input | 本文入力欄 | aria-required="true" |
| タグ入力 | post-tags-input | タグ入力欄 | - |
| 画像アップロード | post-image-upload | 画像アップロード | accept="image/*" |
| 下書きボタン | post-draft-button | 下書き保存ボタン | - |
| プレビューボタン | post-preview-button | プレビュー表示ボタン | - |
| 公開ボタン | post-submit-button | 公開ボタン | aria-busy={loading} |
| 成功メッセージ | success-message | 成功メッセージ | role="alert" |
| エラーメッセージ | error-message | エラーメッセージ | role="alert" |

---

### 5. 投稿詳細ページ (`/posts/:id`)

#### ワイヤーフレーム
```
┌──────────────────────────────────────────────┐
│  [post-detail-container]                     │
│                                              │
│  タイトル [post-detail-title]                │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │ 👤 [post-author-avatar]            │     │
│  │ 投稿者名 [post-author-name]        │     │
│  │ 📅 2024/01/01 [post-date]          │     │
│  └────────────────────────────────────┘     │
│                                              │
│  本文 [post-detail-content]                  │
│  長い本文がここに表示されます...              │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │ ❤️ [post-like-button] 10           │     │
│  │ 🔗 [post-share-button] シェア      │     │
│  │ ✏️ [post-edit-button] 編集         │     │
│  │ 🗑️ [post-delete-button] 削除       │     │
│  └────────────────────────────────────┘     │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                              │
│  コメント (5) [comment-count]                │
│                                              │
│  [comment-form]                              │
│  ┌────────────────────────────────────┐     │
│  │ コメントを入力 [comment-input]     │     │
│  └────────────────────────────────────┘     │
│  [comment-submit-button: コメントする]       │
│                                              │
│  [comment-list]                              │
│  ┌────────────────────────────────────┐     │
│  │ [comment-item-1]                   │     │
│  │ 👤 ユーザー名                       │     │
│  │ コメント本文...                     │     │
│  │ 📅 2024/01/01                      │     │
│  │ 🗑️ [comment-delete-1]              │     │
│  └────────────────────────────────────┘     │
└──────────────────────────────────────────────┘
```

#### ロケーター一覧

| 要素 | data-testid | 説明 |
|------|-------------|------|
| 投稿コンテナ | post-detail-container | 投稿詳細全体 |
| 投稿タイトル | post-detail-title | 投稿タイトル |
| 投稿本文 | post-detail-content | 投稿本文 |
| 投稿者アバター | post-author-avatar | 投稿者アバター |
| 投稿者名 | post-author-name | 投稿者名 |
| 投稿日時 | post-date | 投稿日時 |
| いいねボタン | post-like-button | いいねボタン |
| いいね数 | post-like-count | いいね数表示 |
| シェアボタン | post-share-button | シェアボタン |
| 編集ボタン | post-edit-button | 編集ボタン（自分の投稿） |
| 削除ボタン | post-delete-button | 削除ボタン（自分の投稿） |
| コメント数 | comment-count | コメント数表示 |
| コメントフォーム | comment-form | コメント投稿フォーム |
| コメント入力 | comment-input | コメント入力欄 |
| コメント送信 | comment-submit-button | コメント送信ボタン |
| コメントリスト | comment-list | コメント一覧 |
| コメントアイテム | comment-item-{id} | コメントアイテム |
| コメント削除 | comment-delete-{id} | コメント削除ボタン |

---

## グローバルコンポーネント

### ナビゲーションバー

#### ワイヤーフレーム
```
┌───────────────────────────────────────────────┐
│ [header-nav]                                  │
│  🏠 Logo  [Home] [Posts] [Profile] [Logout]  │
└───────────────────────────────────────────────┘
```

#### ロケーター一覧

| 要素 | data-testid | 説明 |
|------|-------------|------|
| ヘッダー | header-nav | ヘッダー全体 |
| ロゴ | header-logo | ロゴ |
| ホームリンク | nav-home-link | ホームリンク |
| 投稿一覧リンク | nav-posts-link | 投稿一覧リンク |
| プロフィールリンク | nav-profile-link | プロフィールリンク |
| ログアウトボタン | nav-logout-button | ログアウトボタン |

### モーダル

#### ワイヤーフレーム
```
┌───────────────────────────────────┐
│ [delete-modal]                    │
│                                   │
│  投稿を削除しますか？              │
│  [delete-modal-content]           │
│                                   │
│  この操作は取り消せません。        │
│                                   │
│  [delete-cancel-button: キャンセル]│
│  [delete-confirm-button: 削除]    │
└───────────────────────────────────┘
```

#### ロケーター一覧

| 要素 | data-testid | 説明 |
|------|-------------|------|
| モーダル | delete-modal | 削除確認モーダル |
| モーダルタイトル | delete-modal-title | モーダルタイトル |
| モーダル本文 | delete-modal-content | モーダル本文 |
| キャンセルボタン | delete-cancel-button | キャンセルボタン |
| 削除ボタン | delete-confirm-button | 削除確定ボタン |

---

## アクセシビリティ

### ARIA属性の使用ガイドライン

#### 必須のARIA属性

```tsx
// フォーム入力
<input
  aria-required="true"        // 必須項目
  aria-invalid={hasError}     // エラー状態
  aria-describedby="error-1"  // エラーメッセージとの関連付け
/>

// ボタン
<button
  aria-busy={loading}         // ローディング状態
  aria-label="閉じる"         // 視覚的にテキストがない場合
/>

// メッセージ
<div
  role="alert"                // 重要なメッセージ
  aria-live="polite"          // 動的な更新
/>

// モーダル
<div
  role="dialog"               // ダイアログ
  aria-modal="true"           // モーダル状態
  aria-labelledby="modal-title"
/>
```

---

## レスポンシブデザイン

### ブレークポイント

```css
/* モバイル */
@media (max-width: 640px) { }

/* タブレット */
@media (min-width: 641px) and (max-width: 1024px) { }

/* デスクトップ */
@media (min-width: 1025px) { }
```

### モバイル対応

- タッチターゲット: 最小44x44px
- フォントサイズ: 最小16px（ズームを防ぐ）
- ナビゲーション: ハンバーガーメニュー

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| YYYY/MM/DD | 1.0 | 初版作成 | [名前] |
