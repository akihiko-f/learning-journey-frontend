# API設計書 - SimpleBlog

## 概要

SimpleBlogアプリケーションのREST API仕様を定義します。Next.js 14 API Routesを使用して実装します。

---

## 基本情報

### ベースURL
- **開発環境**: `http://localhost:3000/api`
- **本番環境**: `https://simpleblog.vercel.app/api`

### 認証方式
**NextAuth.js (Session-based)**
- セッションCookie: `next-auth.session-token`
- 有効期限: 7日間
- CSRF対策: 自動（NextAuth組み込み）

### 共通ヘッダー
```
Content-Type: application/json
Cookie: next-auth.session-token={session_token}
```

### レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": { ... }
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

---

## エラーコード

| HTTPステータス | エラーコード | 説明 |
|---------------|-------------|------|
| 400 | `VALIDATION_ERROR` | リクエストのバリデーションエラー |
| 401 | `UNAUTHORIZED` | 未認証（ログインが必要） |
| 403 | `FORBIDDEN` | 権限不足（他人のリソースにアクセス等） |
| 404 | `NOT_FOUND` | リソースが見つからない |
| 409 | `CONFLICT` | リソースの競合（重複登録等） |
| 422 | `UNPROCESSABLE_ENTITY` | ビジネスロジックエラー |
| 429 | `RATE_LIMIT_EXCEEDED` | レート制限超過 |
| 500 | `INTERNAL_SERVER_ERROR` | サーバー内部エラー |

---

## エンドポイント一覧

### 認証（Authentication）

#### POST /api/auth/register
新規ユーザー登録

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "name": "John Doe"
}
```

**バリデーション:**
- `email`: RFC 5322準拠、最大254文字
- `password`: 最小8文字、英数字を含む
- `username`: 2-30文字、半角英数字・アンダースコア・ハイフン
- `name`: 1-100文字

**レスポンス（201 Created）:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx123",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe",
      "image": null,
      "role": "USER",
      "createdAt": "2025-12-03T10:00:00.000Z"
    }
  }
}
```

**エラーレスポンス:**
```json
// 400 Bad Request - バリデーションエラー
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "パスワードは8文字以上で入力してください"
  }
}

// 409 Conflict - メールアドレス重複
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "このメールアドレスは既に登録されています"
  }
}
```

---

#### POST /api/auth/[...nextauth]
NextAuth.jsの認証エンドポイント

**ログイン:**
```
POST /api/auth/callback/credentials
```

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**セッション取得:**
```
GET /api/auth/session
```

**レスポンス（200 OK）:**
```json
{
  "user": {
    "id": "clxxx123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  },
  "expires": "2025-12-10T10:00:00.000Z"
}
```

---

### 記事（Posts）

#### GET /api/posts
記事一覧取得（公開記事のみ）

**クエリパラメータ:**
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10、最大: 50）
- `tag`: タグでフィルタ（例: `tag=react`）
- `search`: キーワード検索（タイトル・本文）
- `authorId`: 著者IDでフィルタ

**リクエスト例:**
```
GET /api/posts?page=1&limit=10&tag=react
```

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "clxxx456",
        "title": "Getting Started with Next.js 14",
        "slug": "getting-started-with-nextjs-14",
        "excerpt": "Learn the basics of Next.js 14 App Router",
        "coverImage": "https://res.cloudinary.com/xxx/image.jpg",
        "published": true,
        "author": {
          "id": "clxxx123",
          "name": "John Doe",
          "username": "johndoe",
          "image": null
        },
        "tags": [
          { "id": "tag1", "name": "Next.js", "slug": "nextjs" },
          { "id": "tag2", "name": "React", "slug": "react" }
        ],
        "_count": {
          "comments": 5
        },
        "createdAt": "2025-12-01T10:00:00.000Z",
        "updatedAt": "2025-12-02T15:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

#### GET /api/posts/[id]
記事詳細取得

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx456",
    "title": "Getting Started with Next.js 14",
    "slug": "getting-started-with-nextjs-14",
    "content": "# Introduction\n\nNext.js 14 introduces...",
    "excerpt": "Learn the basics of Next.js 14 App Router",
    "coverImage": "https://res.cloudinary.com/xxx/image.jpg",
    "published": true,
    "authorId": "clxxx123",
    "author": {
      "id": "clxxx123",
      "name": "John Doe",
      "username": "johndoe",
      "image": null
    },
    "tags": [
      { "id": "tag1", "name": "Next.js", "slug": "nextjs" },
      { "id": "tag2", "name": "React", "slug": "react" }
    ],
    "comments": [
      {
        "id": "comment1",
        "content": "Great article!",
        "author": {
          "id": "user2",
          "name": "Jane Smith",
          "username": "janesmith",
          "image": null
        },
        "createdAt": "2025-12-02T12:00:00.000Z"
      }
    ],
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-02T15:00:00.000Z"
  }
}
```

**エラーレスポンス:**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "記事が見つかりません"
  }
}
```

---

#### POST /api/posts
記事作成

**認証**: 必須

**リクエスト:**
```json
{
  "title": "My New Post",
  "content": "# Hello World\n\nThis is my first post.",
  "excerpt": "A short description",
  "coverImage": "https://res.cloudinary.com/xxx/image.jpg",
  "tags": ["react", "nextjs"],
  "published": false
}
```

**バリデーション:**
- `title`: 1-100文字（必須）
- `content`: 1-50,000文字（必須）
- `excerpt`: 0-200文字（任意）
- `coverImage`: 有効なURL（任意）
- `tags`: 0-5個、各タグ1-20文字
- `published`: boolean（デフォルト: false）

**レスポンス（201 Created）:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx789",
    "title": "My New Post",
    "slug": "my-new-post",
    "content": "# Hello World\n\nThis is my first post.",
    "excerpt": "A short description",
    "coverImage": "https://res.cloudinary.com/xxx/image.jpg",
    "published": false,
    "authorId": "clxxx123",
    "createdAt": "2025-12-03T10:00:00.000Z",
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

**エラーレスポンス:**
```json
// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "ログインが必要です"
  }
}

// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "タイトルは100文字以内で入力してください"
  }
}
```

---

#### PUT /api/posts/[id]
記事更新

**認証**: 必須（記事の所有者のみ）

**リクエスト:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "coverImage": "https://res.cloudinary.com/xxx/new-image.jpg",
  "tags": ["react", "typescript"],
  "published": true
}
```

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx789",
    "title": "Updated Title",
    "slug": "updated-title",
    "content": "Updated content...",
    "published": true,
    "updatedAt": "2025-12-03T11:00:00.000Z"
  }
}
```

**エラーレスポンス:**
```json
// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "この記事を編集する権限がありません"
  }
}
```

---

#### DELETE /api/posts/[id]
記事削除

**認証**: 必須（記事の所有者のみ）

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "message": "記事を削除しました"
  }
}
```

---

### コメント（Comments）

#### POST /api/comments
コメント投稿

**認証**: 必須

**リクエスト:**
```json
{
  "postId": "clxxx456",
  "content": "Great article! Very helpful."
}
```

**バリデーション:**
- `postId`: 有効な記事ID（必須）
- `content`: 1-1,000文字（必須）

**レスポンス（201 Created）:**
```json
{
  "success": true,
  "data": {
    "id": "comment123",
    "content": "Great article! Very helpful.",
    "postId": "clxxx456",
    "authorId": "clxxx123",
    "author": {
      "id": "clxxx123",
      "name": "John Doe",
      "username": "johndoe",
      "image": null
    },
    "createdAt": "2025-12-03T10:30:00.000Z"
  }
}
```

**エラーレスポンス:**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "記事が見つかりません"
  }
}
```

---

#### DELETE /api/comments/[id]
コメント削除

**認証**: 必須（コメントの所有者のみ）

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "message": "コメントを削除しました"
  }
}
```

---

### ユーザー（Users）

#### GET /api/users/[id]
ユーザープロフィール取得

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Web developer learning React and Next.js",
    "image": "https://res.cloudinary.com/xxx/profile.jpg",
    "role": "USER",
    "createdAt": "2025-11-01T10:00:00.000Z",
    "posts": [
      {
        "id": "post1",
        "title": "My First Post",
        "slug": "my-first-post",
        "excerpt": "Introduction to blogging",
        "published": true,
        "createdAt": "2025-12-01T10:00:00.000Z"
      }
    ],
    "_count": {
      "posts": 5
    }
  }
}
```

---

#### PATCH /api/users/profile
プロフィール更新

**認証**: 必須（本人のみ）

**リクエスト:**
```json
{
  "name": "John Doe Jr.",
  "bio": "Updated bio",
  "image": "https://res.cloudinary.com/xxx/new-profile.jpg"
}
```

**バリデーション:**
- `name`: 1-100文字
- `bio`: 0-500文字
- `image`: 有効なURL

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "name": "John Doe Jr.",
    "bio": "Updated bio",
    "image": "https://res.cloudinary.com/xxx/new-profile.jpg",
    "updatedAt": "2025-12-03T11:00:00.000Z"
  }
}
```

---

### 画像アップロード（Upload）

#### POST /api/upload
画像アップロード（Cloudinary）

**認証**: 必須

**リクエスト:**
```
Content-Type: multipart/form-data

file: (binary)
type: "post" | "profile"
```

**バリデーション:**
- ファイル形式: JPEG, PNG, WebP, GIF
- ファイルサイズ:
  - `type=post`: 最大5MB
  - `type=profile`: 最大2MB

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/xxx/uploaded-image.jpg",
    "publicId": "simpleblog/posts/abc123",
    "format": "jpg",
    "width": 1200,
    "height": 630
  }
}
```

**エラーレスポンス:**
```json
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "画像サイズは5MB以下にしてください"
  }
}
```

---

### 通知（Notifications）

#### GET /api/notifications
通知一覧取得

**認証**: 必須

**クエリパラメータ:**
- `unreadOnly`: 未読のみ（デフォルト: false）
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20）

**リクエスト例:**
```
GET /api/notifications?unreadOnly=true&page=1&limit=20
```

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif1",
        "type": "COMMENT",
        "message": "John Doeさんがあなたの記事にコメントしました",
        "read": false,
        "actor": {
          "id": "user2",
          "name": "John Doe",
          "username": "johndoe",
          "image": null
        },
        "post": {
          "id": "post1",
          "title": "My First Post",
          "slug": "my-first-post"
        },
        "comment": {
          "id": "comment1",
          "content": "Great post!"
        },
        "createdAt": "2025-12-03T10:00:00.000Z"
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 25
    }
  }
}
```

---

#### PATCH /api/notifications/[id]/read
通知を既読にする

**認証**: 必須

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "id": "notif1",
    "read": true
  }
}
```

---

#### PATCH /api/notifications/read-all
全通知を既読にする

**認証**: 必須

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "message": "5件の通知を既読にしました"
  }
}
```

---

### タグ（Tags）

#### GET /api/tags
タグ一覧取得

**レスポンス（200 OK）:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tag1",
      "name": "React",
      "slug": "react",
      "_count": {
        "posts": 15
      }
    },
    {
      "id": "tag2",
      "name": "Next.js",
      "slug": "nextjs",
      "_count": {
        "posts": 10
      }
    }
  ]
}
```

---

## レート制限

### 制限内容
| エンドポイント | 制限 |
|---------------|------|
| POST /api/auth/register | 5回/時間 |
| POST /api/auth/callback/credentials | 10回/時間 |
| POST /api/posts | 20回/時間 |
| POST /api/comments | 30回/時間 |
| POST /api/upload | 10回/時間 |
| その他のGET | 100回/分 |

### レート制限超過時のレスポンス
```json
// 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト回数の上限に達しました。しばらくしてからもう一度お試しください",
    "retryAfter": 3600
  }
}
```

---

## バージョニング

現時点ではバージョニングなし（v1として運用）。

将来的に破壊的変更が必要な場合:
- URLパスに`/v2/`を追加
- 例: `/api/v2/posts`

---

## CORS設定

**開発環境:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

**本番環境:**
```
Access-Control-Allow-Origin: https://simpleblog.vercel.app
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025/12/03 | 1.0 | 初版作成 | Claude Code |
