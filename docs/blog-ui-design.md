# UI設計書 - SimpleBlog

## 概要

SimpleBlogアプリケーションの画面設計とテストロケーター（data-testid）を統合管理します。

**重要**: 実装前にこのドキュメントで画面設計とロケーターを決定することで、ATDD（受け入れテスト駆動開発）をスムーズに進めます。

---

## UI設計の原則

### デザインシステム

#### カラーパレット（Tailwind CSS）
```css
/* プライマリーカラー */
--primary: blue-600 (#2563eb)
--primary-hover: blue-700 (#1d4ed8)

/* セカンダリーカラー */
--secondary: gray-600 (#4b5563)

/* グレースケール */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827

/* セマンティックカラー */
--success: green-600 (#16a34a)
--error: red-600 (#dc2626)
--warning: yellow-600 (#ca8a04)
--info: sky-600 (#0284c7)
```

#### タイポグラフィ
```css
/* 見出し */
h1: text-4xl (36px) - font-bold
h2: text-3xl (30px) - font-bold
h3: text-2xl (24px) - font-semibold

/* 本文 */
body: text-base (16px) - font-normal
small: text-sm (14px) - font-normal
```

#### スペーシング（Tailwind）
```
1: 0.25rem (4px)
2: 0.5rem (8px)
4: 1rem (16px)
6: 1.5rem (24px)
8: 2rem (32px)
```

---

## ロケーター命名規則

### 基本フォーマット
```
[ページ名]-[機能名]-[要素タイプ]
または
[機能名]-[要素タイプ]-[アクション/状態]
```

### 例
```html
<!-- ページ全体 -->
<div data-testid="login-page">

<!-- フォーム -->
<form data-testid="login-form">

<!-- 入力フィールド -->
<input data-testid="email-input" />
<input data-testid="password-input" />

<!-- ボタン -->
<button data-testid="login-button">ログイン</button>
<button data-testid="post-submit-button">投稿</button>

<!-- エラー・成功メッセージ -->
<div data-testid="error-message">エラー</div>
<div data-testid="success-message">成功</div>

<!-- リスト・アイテム -->
<div data-testid="post-list">
  <article data-testid="post-card-{id}">
</div>
```

---

## 画面一覧と設計

### 1. ログインページ (`/login`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────┐
│                                         │
│              SimpleBlog                 │
│         (data-testid="logo")            │
│                                         │
│           ログイン                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ メールアドレス                    │ │
│  │ [email-input]                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ パスワード                        │ │
│  │ [password-input]          [👁]   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [login-button: ログイン]               │
│                                         │
│  アカウントをお持ちでない方              │
│  [register-link: 新規登録]              │
└─────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `login-page` | div | ページ全体のコンテナ |
| `logo` | img | ロゴ画像 |
| `login-form` | form | ログインフォーム |
| `email-input` | input | メールアドレス入力 |
| `password-input` | input | パスワード入力 |
| `password-toggle` | button | パスワード表示/非表示切り替え |
| `login-button` | button | ログインボタン |
| `register-link` | a | 新規登録リンク |
| `error-message` | div | エラーメッセージ（表示時のみ） |

#### HTML構造例
```tsx
<div data-testid="login-page" className="min-h-screen flex items-center justify-center">
  <div className="max-w-md w-full space-y-8">
    <div className="text-center">
      <img data-testid="logo" src="/logo.svg" alt="SimpleBlog" className="mx-auto h-12" />
      <h1 className="mt-6 text-3xl font-bold">ログイン</h1>
    </div>

    {error && (
      <div data-testid="error-message" role="alert" className="bg-red-50 text-red-600 p-4 rounded">
        {error}
      </div>
    )}

    <form data-testid="login-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          data-testid="email-input"
          type="email"
          required
          aria-required="true"
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          パスワード
        </label>
        <div className="relative">
          <input
            id="password"
            data-testid="password-input"
            type={showPassword ? 'text' : 'password'}
            required
            aria-required="true"
            className="mt-1 block w-full"
          />
          <button
            type="button"
            data-testid="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        data-testid="login-button"
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>

    <p className="text-center text-sm">
      アカウントをお持ちでない方{' '}
      <a
        href="/register"
        data-testid="register-link"
        className="text-blue-600 hover:underline"
      >
        新規登録
      </a>
    </p>
  </div>
</div>
```

---

### 2. 新規登録ページ (`/register`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────┐
│          SimpleBlog                     │
│                                         │
│          新規登録                        │
│                                         │
│  [email-input: メールアドレス]          │
│  [username-input: ユーザー名]           │
│  [name-input: 表示名]                   │
│  [password-input: パスワード]           │
│  [password-confirm-input: 確認]         │
│                                         │
│  [register-button: 登録]                │
│                                         │
│  [login-link: ログインはこちら]         │
└─────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `register-page` | div | ページ全体 |
| `register-form` | form | 登録フォーム |
| `email-input` | input | メールアドレス |
| `username-input` | input | ユーザー名（URL用） |
| `name-input` | input | 表示名 |
| `password-input` | input | パスワード |
| `password-confirm-input` | input | パスワード確認 |
| `register-button` | button | 登録ボタン |
| `login-link` | a | ログインリンク |
| `error-message` | div | エラーメッセージ |

---

### 3. トップページ - 記事一覧 (`/`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header: ロゴ | 検索 | ユーザーメニュー]        │
├─────────────────────────────────────────────────┤
│                                                 │
│  [post-card-1]                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ [アイキャッチ画像]                        │ │
│  │ タイトル                                  │ │
│  │ 本文の抜粋...                             │ │
│  │ @著者名 | 2025/12/03 | #React #Next.js   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [post-card-2]                                  │
│  ...                                            │
│                                                 │
│  [pagination: 1 2 3 ... 10]                    │
│                                                 │
├─────────────────────────────────────────────────┤
│ [footer]                                        │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧

**ヘッダー:**
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `header` | header | グローバルヘッダー |
| `logo` | a | ロゴ（トップページリンク） |
| `search-input` | input | 検索入力 |
| `search-button` | button | 検索ボタン |
| `user-menu-button` | button | ユーザーメニュー（ログイン済み） |
| `user-menu-dropdown` | div | ドロップダウンメニュー |
| `new-post-button` | a | 新規記事作成ボタン |
| `dashboard-link` | a | ダッシュボードリンク |
| `notifications-button` | button | 通知ベル |
| `notifications-badge` | span | 未読通知数バッジ |
| `logout-button` | button | ログアウトボタン |
| `login-button` | a | ログインボタン（未ログイン） |

**記事一覧:**
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `posts-page` | div | ページ全体 |
| `post-list` | div | 記事一覧コンテナ |
| `post-card-{id}` | article | 個別の記事カード |
| `post-cover-{id}` | img | アイキャッチ画像 |
| `post-title-{id}` | h2 | 記事タイトル |
| `post-excerpt-{id}` | p | 記事の抜粋 |
| `post-author-{id}` | a | 著者名リンク |
| `post-date-{id}` | time | 投稿日時 |
| `post-tag-{tagSlug}` | a | タグリンク |
| `post-comment-count-{id}` | span | コメント数 |
| `pagination` | nav | ページネーション |
| `pagination-prev` | button | 前へボタン |
| `pagination-next` | button | 次へボタン |
| `pagination-page-{n}` | button | ページ番号ボタン |

---

### 4. 記事詳細ページ (`/posts/[id]`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  [アイキャッチ画像]                             │
│                                                 │
│  # タイトル                                     │
│  @著者名 | 2025/12/03 | #React #Next.js        │
│  [edit-button (所有者のみ)]                    │
│                                                 │
│  ─────────────────────────────────────────     │
│  本文（Markdown）                               │
│  ...                                            │
│  ─────────────────────────────────────────     │
│                                                 │
│  コメント (5件)                                 │
│  [comment-form]                                 │
│  [comment-list]                                 │
│    - コメント1                                  │
│    - コメント2                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `post-detail-page` | div | ページ全体 |
| `post-cover-image` | img | アイキャッチ画像 |
| `post-title` | h1 | 記事タイトル |
| `post-author` | a | 著者名リンク |
| `post-date` | time | 投稿日時 |
| `post-tags` | div | タグリスト |
| `post-tag-{tagSlug}` | a | 個別タグ |
| `post-content` | div | 本文（マークダウン→HTML） |
| `edit-post-button` | a | 編集ボタン（所有者のみ） |
| `delete-post-button` | button | 削除ボタン（所有者のみ） |
| `comment-section` | section | コメントセクション |
| `comment-count` | h2 | コメント件数 |
| `comment-form` | form | コメント投稿フォーム |
| `comment-input` | textarea | コメント入力欄 |
| `comment-submit-button` | button | コメント投稿ボタン |
| `comment-list` | div | コメント一覧 |
| `comment-item-{id}` | div | 個別コメント |
| `comment-author-{id}` | a | コメント投稿者 |
| `comment-date-{id}` | time | コメント日時 |
| `comment-content-{id}` | p | コメント本文 |
| `comment-delete-{id}` | button | コメント削除（所有者のみ） |

---

### 5. 記事作成ページ (`/posts/new`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  新規記事作成                                   │
│                                                 │
│  [title-input: タイトル]                        │
│                                                 │
│  [cover-image-upload]                           │
│  [アイキャッチ画像プレビュー]                   │
│                                                 │
│  [content-editor: Markdownエディタ]             │
│  ┌─────────────────────────────────────────┐  │
│  │ # 見出し                                │  │
│  │                                         │  │
│  │ 本文を入力...                           │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  [tags-input: タグ（カンマ区切り）]             │
│  例: react, nextjs, typescript                 │
│                                                 │
│  [save-draft-button] [publish-button]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `post-create-page` | div | ページ全体 |
| `post-form` | form | 記事作成フォーム |
| `title-input` | input | タイトル入力 |
| `cover-image-upload` | input[type="file"] | アイキャッチ画像アップロード |
| `cover-image-preview` | img | 画像プレビュー |
| `content-editor` | textarea | 本文エディタ |
| `content-preview` | div | マークダウンプレビュー |
| `tags-input` | input | タグ入力 |
| `save-draft-button` | button | 下書き保存ボタン |
| `publish-button` | button | 公開ボタン |
| `cancel-button` | a | キャンセルリンク |
| `error-message` | div | エラーメッセージ |
| `success-message` | div | 成功メッセージ |

---

### 6. 記事編集ページ (`/posts/[id]/edit`)

記事作成ページと同じUI構造、ロケーターも共通。

**追加のロケーター:**
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `post-edit-page` | div | ページ全体（作成とは別） |
| `delete-post-button` | button | 記事削除ボタン |
| `delete-confirm-modal` | div | 削除確認モーダル |
| `delete-confirm-button` | button | 削除確認ボタン |
| `delete-cancel-button` | button | 削除キャンセルボタン |

---

### 7. ダッシュボード (`/dashboard`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  マイページ                                     │
│                                                 │
│  [new-post-button: 新規記事作成]                │
│                                                 │
│  あなたの記事 (10件)                            │
│  [tab-all] [tab-published] [tab-draft]         │
│                                                 │
│  [my-post-list]                                 │
│  - 記事1 | 公開 | 編集 | 削除                   │
│  - 記事2 | 下書き | 編集 | 削除                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `dashboard-page` | div | ページ全体 |
| `new-post-button` | a | 新規記事作成ボタン |
| `tab-all` | button | 全て表示タブ |
| `tab-published` | button | 公開済みタブ |
| `tab-draft` | button | 下書きタブ |
| `my-post-list` | div | 自分の記事一覧 |
| `my-post-item-{id}` | div | 個別記事アイテム |
| `my-post-title-{id}` | a | 記事タイトル |
| `my-post-status-{id}` | span | ステータス（公開/下書き） |
| `my-post-edit-{id}` | a | 編集リンク |
| `my-post-delete-{id}` | button | 削除ボタン |

---

### 8. ユーザープロフィールページ (`/users/[id]`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  [プロフィール画像]                             │
│  John Doe (@johndoe)                            │
│  Web developer learning React and Next.js       │
│  [edit-profile-button (本人のみ)]              │
│                                                 │
│  投稿記事 (5件)                                 │
│  [user-post-list]                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `user-profile-page` | div | ページ全体 |
| `user-avatar` | img | プロフィール画像 |
| `user-name` | h1 | ユーザー名 |
| `user-username` | p | @ユーザー名 |
| `user-bio` | p | 自己紹介文 |
| `edit-profile-button` | a | プロフィール編集（本人のみ） |
| `user-post-list` | div | ユーザーの投稿記事一覧 |
| `user-post-count` | span | 投稿数 |

---

### 9. プロフィール編集ページ (`/settings/profile`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  プロフィール編集                               │
│                                                 │
│  [current-avatar]                               │
│  [avatar-upload-button]                         │
│                                                 │
│  [name-input: 表示名]                           │
│  [bio-input: 自己紹介]                          │
│                                                 │
│  [save-button] [cancel-button]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `profile-edit-page` | div | ページ全体 |
| `profile-form` | form | プロフィール編集フォーム |
| `current-avatar` | img | 現在のプロフィール画像 |
| `avatar-upload` | input[type="file"] | 画像アップロード |
| `avatar-preview` | img | 画像プレビュー |
| `name-input` | input | 表示名入力 |
| `bio-input` | textarea | 自己紹介入力 |
| `save-button` | button | 保存ボタン |
| `cancel-button` | a | キャンセルリンク |

---

### 10. 通知一覧ページ (`/notifications`)

#### ワイヤーフレーム
```
┌─────────────────────────────────────────────────┐
│ [header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  通知                                           │
│  [mark-all-read-button]                         │
│                                                 │
│  [notification-list]                            │
│  ● John Doeさんがコメントしました               │
│  ○ Jane Smithさんがいいねしました               │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### ロケーター一覧
| data-testid | 要素 | 説明 |
|-------------|------|------|
| `notifications-page` | div | ページ全体 |
| `mark-all-read-button` | button | 全て既読ボタン |
| `notification-list` | div | 通知一覧 |
| `notification-item-{id}` | div | 個別通知 |
| `notification-message-{id}` | p | 通知メッセージ |
| `notification-date-{id}` | time | 通知日時 |
| `notification-link-{id}` | a | 関連記事リンク |
| `notification-unread-{id}` | span | 未読マーク |

---

## アクセシビリティ（ARIA属性）

### 必須ARIA属性

#### フォーム
```html
<input
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
<div id="error-message" role="alert">エラー</div>
```

#### ボタン
```html
<button aria-busy={loading} aria-label="ログイン">
  {loading ? 'ログイン中...' : 'ログイン'}
</button>
```

#### ナビゲーション
```html
<nav aria-label="ページネーション">
  <button aria-label="前のページ" aria-disabled={!hasPrev}>前へ</button>
  <button aria-current="page">1</button>
</nav>
```

---

## レスポンシブデザイン

### ブレークポイント（Tailwind CSS）
```
sm: 640px   (タブレット)
md: 768px   (タブレット横)
lg: 1024px  (PC小)
xl: 1280px  (PC大)
```

### レスポンシブパターン
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* モバイル: 1列、タブレット: 2列、PC: 3列 */}
</div>
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025/12/03 | 1.0 | 初版作成 | Claude Code |
