# データベース設計書

## 概要

このドキュメントでは、アプリケーションのデータベース構造を定義します。

---

## データベース情報

### データベース種別
[PostgreSQL / MySQL / MongoDB / SQLite など]

### ORM/クエリビルダー
[Prisma / Drizzle / TypeORM など]

---

## ER図

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Users     │         │   Posts     │         │  Comments   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │◄────────┤ id (PK)     │◄────────┤ id (PK)     │
│ email       │         │ authorId(FK)│         │ postId (FK) │
│ password    │         │ title       │         │ authorId(FK)│
│ name        │         │ content     │         │ content     │
│ bio         │         │ createdAt   │         │ createdAt   │
│ createdAt   │         │ updatedAt   │         └─────────────┘
│ updatedAt   │         └─────────────┘
└─────────────┘
       │                      │
       │                      │
       │                      ▼
       │               ┌─────────────┐
       └──────────────►│   Likes     │
                       ├─────────────┤
                       │ id (PK)     │
                       │ userId (FK) │
                       │ postId (FK) │
                       │ createdAt   │
                       └─────────────┘
```

---

## テーブル定義

### Users（ユーザー）

ユーザー情報を管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | ユーザーID（主キー） |
| email | VARCHAR(255) | NO | - | メールアドレス（ユニーク） |
| password | VARCHAR(255) | NO | - | ハッシュ化されたパスワード |
| name | VARCHAR(100) | NO | - | ユーザー名 |
| bio | TEXT | YES | NULL | 自己紹介 |
| avatar | VARCHAR(500) | YES | NULL | プロフィール画像URL |
| createdAt | TIMESTAMP | NO | NOW() | 作成日時 |
| updatedAt | TIMESTAMP | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- INDEX: `createdAt`

**制約:**
- `email`: UNIQUE制約、メール形式のバリデーション
- `password`: 最小8文字（アプリケーション層で検証）

---

### Posts（投稿）

ユーザーの投稿を管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | 投稿ID（主キー） |
| authorId | UUID | NO | - | 投稿者ID（外部キー → Users.id） |
| title | VARCHAR(200) | NO | - | 投稿タイトル |
| content | TEXT | NO | - | 投稿本文 |
| slug | VARCHAR(250) | YES | NULL | URL用スラッグ |
| published | BOOLEAN | NO | false | 公開状態 |
| viewCount | INTEGER | NO | 0 | 閲覧数 |
| createdAt | TIMESTAMP | NO | NOW() | 作成日時 |
| updatedAt | TIMESTAMP | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `authorId` → `Users.id`
- UNIQUE INDEX: `slug`
- INDEX: `authorId, createdAt`
- INDEX: `published, createdAt`

**制約:**
- `authorId`: 外部キー制約、ON DELETE CASCADE
- `slug`: UNIQUE制約（NULL許可）

---

### Comments（コメント）

投稿に対するコメントを管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | コメントID（主キー） |
| postId | UUID | NO | - | 投稿ID（外部キー → Posts.id） |
| authorId | UUID | NO | - | 投稿者ID（外部キー → Users.id） |
| content | TEXT | NO | - | コメント本文 |
| createdAt | TIMESTAMP | NO | NOW() | 作成日時 |
| updatedAt | TIMESTAMP | NO | NOW() | 更新日時 |

**インデックス:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `postId` → `Posts.id`
- FOREIGN KEY: `authorId` → `Users.id`
- INDEX: `postId, createdAt`
- INDEX: `authorId`

**制約:**
- `postId`: 外部キー制約、ON DELETE CASCADE
- `authorId`: 外部キー制約、ON DELETE CASCADE

---

### Likes（いいね）

投稿に対するいいねを管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | いいねID（主キー） |
| userId | UUID | NO | - | ユーザーID（外部キー → Users.id） |
| postId | UUID | NO | - | 投稿ID（外部キー → Posts.id） |
| createdAt | TIMESTAMP | NO | NOW() | 作成日時 |

**インデックス:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `Users.id`
- FOREIGN KEY: `postId` → `Posts.id`
- UNIQUE INDEX: `userId, postId` （同じユーザーが同じ投稿に複数回いいねできないように）
- INDEX: `postId`

**制約:**
- `userId`: 外部キー制約、ON DELETE CASCADE
- `postId`: 外部キー制約、ON DELETE CASCADE
- UNIQUE制約: (userId, postId)

---

### Tags（タグ）

投稿に付与するタグを管理するテーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | uuid_generate_v4() | タグID（主キー） |
| name | VARCHAR(50) | NO | - | タグ名 |
| slug | VARCHAR(50) | NO | - | URL用スラッグ |
| createdAt | TIMESTAMP | NO | NOW() | 作成日時 |

**インデックス:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `name`
- UNIQUE INDEX: `slug`

---

### PostTags（投稿とタグの中間テーブル）

投稿とタグの多対多関係を管理する中間テーブル。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| postId | UUID | NO | - | 投稿ID（外部キー → Posts.id） |
| tagId | UUID | NO | - | タグID（外部キー → Tags.id） |

**インデックス:**
- PRIMARY KEY: `postId, tagId`
- FOREIGN KEY: `postId` → `Posts.id`
- FOREIGN KEY: `tagId` → `Tags.id`
- INDEX: `tagId`

**制約:**
- `postId`: 外部キー制約、ON DELETE CASCADE
- `tagId`: 外部キー制約、ON DELETE CASCADE

---

## Prismaスキーマ例

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts    Post[]
  comments Comment[]
  likes    Like[]

  @@index([createdAt])
}

model Post {
  id        String   @id @default(uuid())
  authorId  String
  title     String
  content   String   @db.Text
  slug      String?  @unique
  published Boolean  @default(false)
  viewCount Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[]
  likes    Like[]
  tags     PostTag[]

  @@index([authorId, createdAt])
  @@index([published, createdAt])
}

model Comment {
  id        String   @id @default(uuid())
  postId    String
  authorId  String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([postId, createdAt])
  @@index([authorId])
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([postId])
}

model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  posts PostTag[]
}

model PostTag {
  postId String
  tagId  String

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([tagId])
}
```

---

## マイグレーション戦略

### 初期セットアップ
```bash
# Prismaの初期化
npx prisma init

# マイグレーション作成
npx prisma migrate dev --name init

# Prisma Clientの生成
npx prisma generate
```

### スキーマ変更時
```bash
# マイグレーション作成
npx prisma migrate dev --name add_user_bio

# 本番環境へのデプロイ
npx prisma migrate deploy
```

---

## データベース初期データ（Seed）

開発環境やテスト環境用の初期データを投入します。

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ユーザーの作成
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'hashed_password',
      name: '山田太郎',
      bio: 'Webエンジニアです'
    }
  })

  // 投稿の作成
  await prisma.post.create({
    data: {
      authorId: user1.id,
      title: 'はじめての投稿',
      content: 'よろしくお願いします！',
      published: true
    }
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
```

**実行方法:**
```bash
npx prisma db seed
```

---

## パフォーマンス最適化

### インデックス戦略
- 頻繁に検索される列にインデックスを作成
- 複合インデックスは使用頻度の高い順に設定
- 不要なインデックスは削除（書き込みパフォーマンスに影響）

### クエリ最適化
```typescript
// ❌ N+1問題が発生
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } })
}

// ✅ includeで一度に取得
const posts = await prisma.post.findMany({
  include: {
    author: true
  }
})
```

### ページネーション
```typescript
// カーソルベースページネーション（推奨）
const posts = await prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: {
    id: lastPostId
  },
  orderBy: {
    createdAt: 'desc'
  }
})
```

---

## バックアップ戦略

### 自動バックアップ
- 毎日深夜にフルバックアップ
- 1週間分のバックアップを保持
- 重要な操作前に手動バックアップ

### リストア手順
```bash
# PostgreSQLの場合
pg_restore -h localhost -U username -d dbname backup.dump
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| YYYY/MM/DD | 1.0 | 初版作成 | [名前] |
