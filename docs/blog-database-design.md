# データベース設計書 - SimpleBlog

## 概要

SimpleBlogアプリケーションのデータベース構造を定義します。リレーショナルデータベース（PostgreSQL）を使用し、Prisma ORMで管理します。

---

## データベース情報

### データベース種別
**PostgreSQL 15**
- 本番環境: Supabase（無料プラン）
- 開発環境: Docker Compose（ローカル）

### ORM/クエリビルダー
**Prisma 5**
- スキーマ定義: `prisma/schema.prisma`
- マイグレーション: Prisma Migrate
- TypeScript型生成: 自動

---

## ER図

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password         │──┐
│ username (UNIQUE)│  │
│ name             │  │
│ bio              │  │
│ image            │  │
│ role             │  │
│ createdAt        │  │
│ updatedAt        │  │
└──────────────────┘  │
         │            │
         │ 1          │
         │            │
         │ *          │
         ▼            │
┌──────────────────┐  │
│      Post        │  │
├──────────────────┤  │
│ id (PK)          │  │
│ title            │  │
│ slug (UNIQUE)    │  │
│ content          │  │
│ excerpt          │  │
│ coverImage       │  │
│ published        │  │
│ authorId (FK)────┘
│ createdAt        │
│ updatedAt        │
└──────────────────┘
    │           │
    │ 1         │ 1
    │           │
    │ *         │ *
    ▼           ▼
┌──────────────────┐     ┌──────────────────┐
│    Comment       │     │    PostTag       │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ postId (FK)      │───┐
│ content          │     │ tagId (FK)       │───┼─┐
│ postId (FK)      │     └──────────────────┘   │ │
│ authorId (FK)────┐                            │ │
│ createdAt        │                            │ │
│ updatedAt        │                            │ │
└──────────────────┘                            │ │
                                                │ │
┌──────────────────┐                            │ │
│   Notification   │                            │ │
├──────────────────┤                            │ │
│ id (PK)          │                            │ │
│ type             │                            │ │
│ message          │                            │ │
│ recipientId (FK)─┼──┐                         │ │
│ actorId (FK)─────┼──┼─────────────────────────┘ │
│ postId (FK)      │  │                           │
│ commentId (FK)   │  │                           │
│ read             │  │                           │
│ createdAt        │  │                           │
└──────────────────┘  │                           │
                      │                           │
                      └───────────────────────────┘
                      (User)

┌──────────────────┐
│       Tag        │◄───────────────────────────────┘
├──────────────────┤
│ id (PK)          │
│ name (UNIQUE)    │
│ slug (UNIQUE)    │
│ createdAt        │
└──────────────────┘
```

---

## テーブル定義

### User（ユーザー）

ユーザー情報を管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | String (cuid) | NO | cuid() | ユーザーID（主キー） |
| email | String(254) | NO | - | メールアドレス |
| password | String(255) | NO | - | bcryptでハッシュ化されたパスワード |
| username | String(30) | NO | - | ユーザー名（URL表示用） |
| name | String(100) | NO | - | 表示名 |
| bio | String(500) | YES | NULL | 自己紹介文 |
| image | String(500) | YES | NULL | プロフィール画像URL（Cloudinary） |
| role | Enum | NO | USER | ユーザーロール（USER, ADMIN） |
| createdAt | DateTime | NO | NOW() | 作成日時 |
| updatedAt | DateTime | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- UNIQUE INDEX: `username`
- INDEX: `createdAt DESC` （新規ユーザー順）

**制約:**
- `email`: UNIQUE、RFC 5322準拠
- `username`: UNIQUE、半角英数字・アンダースコア・ハイフン、2-30文字
- `password`: bcrypt（saltRounds: 10）
- `role`: Enum（USER, ADMIN）

**リレーション:**
- `posts`: Post[] (1:多) - ユーザーが投稿した記事
- `comments`: Comment[] (1:多) - ユーザーが投稿したコメント
- `notifications`: Notification[] (1:多、recipientId) - 受信した通知
- `sentNotifications`: Notification[] (1:多、actorId) - 送信した通知

---

### Post（記事）

ブログ記事を管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | String (cuid) | NO | cuid() | 記事ID（主キー） |
| title | String(100) | NO | - | 記事タイトル |
| slug | String(150) | NO | - | URLスラッグ（自動生成） |
| content | Text | NO | - | Markdown形式の本文（最大50,000文字） |
| excerpt | String(200) | YES | NULL | 記事の要約（自動生成または手動） |
| coverImage | String(500) | YES | NULL | アイキャッチ画像URL（Cloudinary） |
| published | Boolean | NO | false | 公開状態（true: 公開、false: 下書き） |
| authorId | String | NO | - | 著者ID（User.id） |
| createdAt | DateTime | NO | NOW() | 作成日時 |
| updatedAt | DateTime | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `slug`
- INDEX: `authorId`
- INDEX: `published, createdAt DESC` （公開記事の新着順）
- INDEX: `createdAt DESC`

**制約:**
- `title`: 1-100文字
- `slug`: UNIQUE、自動生成（タイトルから）
- `content`: 1-50,000文字
- `excerpt`: 0-200文字

**リレーション:**
- `author`: User (多:1) - 記事の著者
- `comments`: Comment[] (1:多) - 記事へのコメント
- `tags`: PostTag[] (1:多) - 記事に付与されたタグ
- `notifications`: Notification[] (1:多) - 記事に関連する通知

---

### Comment（コメント）

記事へのコメントを管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | String (cuid) | NO | cuid() | コメントID（主キー） |
| content | String(1000) | NO | - | コメント本文 |
| postId | String | NO | - | 記事ID（Post.id） |
| authorId | String | NO | - | 投稿者ID（User.id） |
| createdAt | DateTime | NO | NOW() | 作成日時 |
| updatedAt | DateTime | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- INDEX: `postId, createdAt ASC` （記事のコメントを投稿順で取得）
- INDEX: `authorId`

**制約:**
- `content`: 1-1,000文字

**リレーション:**
- `post`: Post (多:1) - コメントが投稿された記事
- `author`: User (多:1) - コメント投稿者
- `notifications`: Notification[] (1:多) - コメントに関連する通知

---

### Tag（タグ）

記事のタグを管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | String (cuid) | NO | cuid() | タグID（主キー） |
| name | String(20) | NO | - | タグ名 |
| slug | String(20) | NO | - | URLスラッグ（自動生成） |
| createdAt | DateTime | NO | NOW() | 作成日時 |

**インデックス:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `name`
- UNIQUE INDEX: `slug`

**制約:**
- `name`: UNIQUE、1-20文字
- `slug`: UNIQUE、自動生成

**リレーション:**
- `posts`: PostTag[] (1:多) - このタグが付与された記事

---

### PostTag（記事-タグ中間テーブル）

記事とタグの多対多リレーションを管理する中間テーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| postId | String | NO | - | 記事ID（Post.id） |
| tagId | String | NO | - | タグID（Tag.id） |

**インデックス:**
- PRIMARY KEY: `(postId, tagId)` 複合主キー
- INDEX: `tagId` （タグから記事を検索）

**リレーション:**
- `post`: Post (多:1)
- `tag`: Tag (多:1)

---

### Notification（通知）

ユーザーへの通知を管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | String (cuid) | NO | cuid() | 通知ID（主キー） |
| type | Enum | NO | - | 通知タイプ（COMMENT, LIKE など） |
| message | String(200) | NO | - | 通知メッセージ |
| recipientId | String | NO | - | 受信者ID（User.id） |
| actorId | String | NO | - | 行動者ID（User.id） |
| postId | String | YES | NULL | 関連記事ID（Post.id） |
| commentId | String | YES | NULL | 関連コメントID（Comment.id） |
| read | Boolean | NO | false | 既読フラグ |
| createdAt | DateTime | NO | NOW() | 作成日時 |

**インデックス:**
- PRIMARY KEY: `id`
- INDEX: `recipientId, read, createdAt DESC` （未読通知を新着順で取得）
- INDEX: `actorId`

**制約:**
- `type`: Enum（COMMENT, LIKE, FOLLOW など）
- `read`: デフォルトfalse

**リレーション:**
- `recipient`: User (多:1、recipientId) - 通知受信者
- `actor`: User (多:1、actorId) - 通知の起因となるアクション実行者
- `post`: Post? (多:1、オプショナル) - 関連記事
- `comment`: Comment? (多:1、オプショナル) - 関連コメント

---

## Prismaスキーマ

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ユーザーロール
enum Role {
  USER
  ADMIN
}

// 通知タイプ
enum NotificationType {
  COMMENT    // 記事にコメントされた
  LIKE       // 記事にいいねされた（将来実装）
  FOLLOW     // フォローされた（将来実装）
}

// ユーザー
model User {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(254)
  password  String   @db.VarChar(255)
  username  String   @unique @db.VarChar(30)
  name      String   @db.VarChar(100)
  bio       String?  @db.VarChar(500)
  image     String?  @db.VarChar(500)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // リレーション
  posts               Post[]
  comments            Comment[]
  notifications       Notification[] @relation("NotificationRecipient")
  sentNotifications   Notification[] @relation("NotificationActor")

  @@index([createdAt(sort: Desc)])
}

// 記事
model Post {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(100)
  slug        String   @unique @db.VarChar(150)
  content     String   @db.Text
  excerpt     String?  @db.VarChar(200)
  coverImage  String?  @db.VarChar(500)
  published   Boolean  @default(false)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // リレーション
  author        User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments      Comment[]
  tags          PostTag[]
  notifications Notification[]

  @@index([authorId])
  @@index([published, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

// コメント
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.VarChar(1000)
  postId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // リレーション
  post          Post           @relation(fields: [postId], references: [id], onDelete: Cascade)
  author        User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  notifications Notification[]

  @@index([postId, createdAt(sort: Asc)])
  @@index([authorId])
}

// タグ
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique @db.VarChar(20)
  slug      String   @unique @db.VarChar(20)
  createdAt DateTime @default(now())

  // リレーション
  posts PostTag[]
}

// 記事-タグ中間テーブル
model PostTag {
  postId String
  tagId  String

  // リレーション
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([tagId])
}

// 通知
model Notification {
  id          String           @id @default(cuid())
  type        NotificationType
  message     String           @db.VarChar(200)
  recipientId String
  actorId     String
  postId      String?
  commentId   String?
  read        Boolean          @default(false)
  createdAt   DateTime         @default(now())

  // リレーション
  recipient User     @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
  actor     User     @relation("NotificationActor", fields: [actorId], references: [id], onDelete: Cascade)
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@index([recipientId, read, createdAt(sort: Desc)])
  @@index([actorId])
}
```

---

## マイグレーション戦略

### 開発環境

1. **スキーマ変更時**:
   ```bash
   npx prisma migrate dev --name <変更内容>
   ```
   - マイグレーションファイル自動生成
   - データベース更新
   - Prisma Client再生成

2. **データベースリセット**（開発時のみ）:
   ```bash
   npx prisma migrate reset
   ```
   - 全テーブル削除
   - マイグレーション再実行
   - シードデータ投入

### 本番環境

1. **本番適用**:
   ```bash
   npx prisma migrate deploy
   ```
   - マイグレーション適用（ダウンタイムなし）

2. **バックアップ**:
   - 本番適用前に必ずSupabaseのバックアップを取得

---

## パフォーマンス最適化

### インデックス戦略

#### 1. 検索頻度の高いクエリ
- `Post`: `(published, createdAt DESC)` - 公開記事一覧
- `Comment`: `(postId, createdAt ASC)` - 記事のコメント一覧
- `Notification`: `(recipientId, read, createdAt DESC)` - 未読通知

#### 2. JOIN性能向上
- 外部キーに自動的にインデックス作成
- `authorId`, `postId`, `tagId` など

### クエリ最適化

#### Eager Loading（N+1問題回避）
```typescript
// 悪い例（N+1問題）
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } })
}

// 良い例（includeで一度に取得）
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { id: true, name: true, username: true, image: true }
    },
    _count: {
      select: { comments: true }
    }
  }
})
```

#### ページネーション
```typescript
// カーソルベースページネーション（大規模データ向け）
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastPostId },
  where: { published: true },
  orderBy: { createdAt: 'desc' }
})
```

---

## シードデータ

開発環境用のテストデータを定義します。

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 管理者ユーザー
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      username: 'admin',
      name: 'Admin User',
      role: 'ADMIN',
    }
  })

  // 一般ユーザー
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: await bcrypt.hash('password123', 10),
      username: 'johndoe',
      name: 'John Doe',
      bio: 'Web developer learning React and Next.js',
    }
  })

  // タグ作成
  const reactTag = await prisma.tag.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React', slug: 'react' }
  })

  const nextjsTag = await prisma.tag.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js', slug: 'nextjs' }
  })

  // サンプル記事
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: '# Introduction\n\nNext.js 14 introduces...',
      excerpt: 'Learn the basics of Next.js 14 App Router',
      published: true,
      authorId: user1.id,
      tags: {
        create: [
          { tagId: reactTag.id },
          { tagId: nextjsTag.id }
        ]
      }
    }
  })

  // コメント
  await prisma.comment.create({
    data: {
      content: 'Great article! Very helpful.',
      postId: post1.id,
      authorId: admin.id
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**実行方法**:
```bash
npx prisma db seed
```

---

## バックアップ戦略

### 本番環境（Supabase）
- **自動バックアップ**: 毎日実行（Supabaseの機能）
- **保持期間**: 7日間
- **リストア**: Supabaseダッシュボードから実行

### 開発環境
- **手動エクスポート**:
  ```bash
  pg_dump -U postgres -d simpleblog > backup.sql
  ```
- **リストア**:
  ```bash
  psql -U postgres -d simpleblog < backup.sql
  ```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025/12/03 | 1.0 | 初版作成 | Claude Code |
