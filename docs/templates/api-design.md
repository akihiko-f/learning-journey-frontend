# API設計書

## 概要

このドキュメントでは、アプリケーションのAPI仕様を定義します。

---

## 基本情報

### ベースURL
- **開発環境**: `http://localhost:3000/api`
- **本番環境**: `https://example.com/api`

### 共通ヘッダー
```
Content-Type: application/json
Authorization: Bearer {token}
```

### レスポンス形式

#### 成功時
```json
{
  "data": { ... },
  "message": "成功メッセージ"
}
```

#### エラー時
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": [ ... ]
  }
}
```

---

## エンドポイント一覧

### 認証（Authentication）

#### POST /api/auth/signup
新規ユーザー登録

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "山田太郎"
}
```

**レスポンス（201 Created）:**
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "山田太郎"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "アカウントを作成しました"
}
```

**エラーレスポンス:**
- `400 Bad Request` - バリデーションエラー
- `409 Conflict` - メールアドレスが既に使用されている

---

#### POST /api/auth/login
ログイン

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（200 OK）:**
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "山田太郎"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "ログインしました"
}
```

**エラーレスポンス:**
- `400 Bad Request` - バリデーションエラー
- `401 Unauthorized` - メールアドレスまたはパスワードが間違っている

---

#### POST /api/auth/logout
ログアウト

**リクエスト:**
```
Authorization: Bearer {token}
```

**レスポンス（200 OK）:**
```json
{
  "message": "ログアウトしました"
}
```

---

### ユーザー（Users）

#### GET /api/users/me
ログイン中のユーザー情報を取得

**リクエスト:**
```
Authorization: Bearer {token}
```

**レスポンス（200 OK）:**
```json
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "山田太郎",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**エラーレスポンス:**
- `401 Unauthorized` - トークンが無効または期限切れ

---

#### PATCH /api/users/me
ユーザー情報を更新

**リクエスト:**
```json
{
  "name": "山田次郎",
  "bio": "自己紹介文"
}
```

**レスポンス（200 OK）:**
```json
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "山田次郎",
    "bio": "自己紹介文",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "プロフィールを更新しました"
}
```

---

### 投稿（Posts）

#### GET /api/posts
投稿一覧を取得

**クエリパラメータ:**
- `page` (optional): ページ番号（デフォルト: 1）
- `limit` (optional): 1ページあたりの件数（デフォルト: 20、最大: 100）
- `sort` (optional): ソート順（`latest` | `oldest` | `popular`）
- `search` (optional): 検索キーワード

**リクエスト例:**
```
GET /api/posts?page=1&limit=20&sort=latest&search=React
```

**レスポンス（200 OK）:**
```json
{
  "data": {
    "posts": [
      {
        "id": "post_123",
        "title": "Reactの基礎",
        "content": "Reactについて学びました...",
        "author": {
          "id": "user_123",
          "name": "山田太郎"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "likes": 10,
        "comments": 3
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

#### GET /api/posts/:id
特定の投稿を取得

**レスポンス（200 OK）:**
```json
{
  "data": {
    "id": "post_123",
    "title": "Reactの基礎",
    "content": "Reactについて学びました...",
    "author": {
      "id": "user_123",
      "name": "山田太郎",
      "avatar": "https://..."
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z",
    "likes": 10,
    "comments": [
      {
        "id": "comment_1",
        "content": "参考になりました！",
        "author": {
          "id": "user_456",
          "name": "佐藤花子"
        },
        "createdAt": "2024-01-01T01:00:00Z"
      }
    ]
  }
}
```

**エラーレスポンス:**
- `404 Not Found` - 投稿が見つからない

---

#### POST /api/posts
新しい投稿を作成

**リクエスト:**
```json
{
  "title": "Reactの基礎",
  "content": "Reactについて学びました...",
  "tags": ["React", "JavaScript"]
}
```

**レスポンス（201 Created）:**
```json
{
  "data": {
    "id": "post_123",
    "title": "Reactの基礎",
    "content": "Reactについて学びました...",
    "author": {
      "id": "user_123",
      "name": "山田太郎"
    },
    "tags": ["React", "JavaScript"],
    "createdAt": "2024-01-01T00:00:00Z",
    "likes": 0,
    "comments": 0
  },
  "message": "投稿を作成しました"
}
```

**エラーレスポンス:**
- `400 Bad Request` - バリデーションエラー
- `401 Unauthorized` - 未ログイン

---

#### PATCH /api/posts/:id
投稿を更新

**リクエスト:**
```json
{
  "title": "Reactの基礎（更新版）",
  "content": "更新した内容..."
}
```

**レスポンス（200 OK）:**
```json
{
  "data": {
    "id": "post_123",
    "title": "Reactの基礎（更新版）",
    "content": "更新した内容...",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "投稿を更新しました"
}
```

**エラーレスポンス:**
- `403 Forbidden` - 他人の投稿は編集できない
- `404 Not Found` - 投稿が見つからない

---

#### DELETE /api/posts/:id
投稿を削除

**レスポンス（200 OK）:**
```json
{
  "message": "投稿を削除しました"
}
```

**エラーレスポンス:**
- `403 Forbidden` - 他人の投稿は削除できない
- `404 Not Found` - 投稿が見つからない

---

### コメント（Comments）

#### POST /api/posts/:id/comments
投稿にコメントを追加

**リクエスト:**
```json
{
  "content": "参考になりました！"
}
```

**レスポンス（201 Created）:**
```json
{
  "data": {
    "id": "comment_1",
    "content": "参考になりました！",
    "author": {
      "id": "user_456",
      "name": "佐藤花子"
    },
    "postId": "post_123",
    "createdAt": "2024-01-01T01:00:00Z"
  },
  "message": "コメントを投稿しました"
}
```

---

#### DELETE /api/comments/:id
コメントを削除

**レスポンス（200 OK）:**
```json
{
  "message": "コメントを削除しました"
}
```

**エラーレスポンス:**
- `403 Forbidden` - 他人のコメントは削除できない
- `404 Not Found` - コメントが見つからない

---

### いいね（Likes）

#### POST /api/posts/:id/like
投稿にいいねする

**レスポンス（200 OK）:**
```json
{
  "data": {
    "likes": 11
  },
  "message": "いいねしました"
}
```

---

#### DELETE /api/posts/:id/like
いいねを取り消す

**レスポンス（200 OK）:**
```json
{
  "data": {
    "likes": 10
  },
  "message": "いいねを取り消しました"
}
```

---

## エラーコード一覧

| コード | 説明 |
|--------|------|
| `VALIDATION_ERROR` | 入力値のバリデーションエラー |
| `AUTHENTICATION_ERROR` | 認証エラー |
| `AUTHORIZATION_ERROR` | 権限エラー |
| `NOT_FOUND` | リソースが見つからない |
| `CONFLICT` | リソースの重複 |
| `SERVER_ERROR` | サーバー内部エラー |

---

## レート制限

API呼び出しには以下のレート制限があります：

- **認証なし**: 100リクエスト/時間
- **認証あり**: 1000リクエスト/時間

レート制限を超えた場合：
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト数の上限を超えました。しばらく待ってから再度お試しください。",
    "retryAfter": 3600
  }
}
```

---

## バージョニング

APIのバージョンはURLに含めます：
- `https://example.com/api/v1/posts`
- `https://example.com/api/v2/posts`

破壊的な変更がある場合は新しいバージョンを作成します。

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| YYYY/MM/DD | 1.0 | 初版作成 | [名前] |
