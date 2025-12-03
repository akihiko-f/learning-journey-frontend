# システム設計書 - SimpleBlog

## システム概要

### アーキテクチャ概要

SimpleBlogは、Next.js 14のApp Routerを使用したフルスタックWebアプリケーションです。フロントエンド、バックエンド、データベースを一つのNext.jsプロジェクトで管理します。

```
┌─────────────────────────────────────────────────────┐
│              クライアント（ブラウザ）                    │
│  - React 18 (Server Components + Client Components) │
│  - Tailwind CSS + shadcn/ui                         │
└─────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────┐
│           Next.js 14 (App Router)                   │
│  ┌─────────────────┬──────────────────┐            │
│  │  Pages & Routes │  API Routes      │            │
│  │  (RSC + Client) │  (Server-side)   │            │
│  └─────────────────┴──────────────────┘            │
│              ↓                  ↓                    │
│      ┌──────────────┐   ┌──────────────┐           │
│      │ NextAuth.js  │   │   Prisma ORM │           │
│      │  (認証)       │   │ (Database)   │           │
│      └──────────────┘   └──────────────┘           │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│         PostgreSQL Database (Supabase)              │
│  - Users, Posts, Comments, Notifications            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│      Cloudinary (画像ストレージ)                      │
│  - Profile Images, Post Cover Images                │
└─────────────────────────────────────────────────────┘
```

### 技術スタック詳細

**フロントエンド:**
- Next.js 14.2+ (App Router)
- React 18 (Server Components + Client Components)
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui (Radix UI)
- React Hook Form + Zod

**バックエンド:**
- Next.js API Routes
- NextAuth.js v4 (認証)
- Prisma 5 (ORM)
- bcrypt (パスワードハッシュ化)

**データベース:**
- PostgreSQL 15 (Supabase)

**デプロイ:**
- Vercel (ホスティング + CI/CD)

---

## ディレクトリ構成

```
simple-blog/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 認証グループ（ヘッダー/フッターなし）
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # ログインページ
│   │   │   ├── register/
│   │   │   │   └── page.tsx         # 新規登録ページ
│   │   │   └── layout.tsx           # 認証レイアウト
│   │   ├── (main)/                   # メインコンテンツグループ
│   │   │   ├── page.tsx             # トップページ（記事一覧）
│   │   │   ├── posts/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx    # 記事詳細
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx # 記事編集
│   │   │   │   └── new/
│   │   │   │       └── page.tsx    # 記事作成
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # マイページ
│   │   │   ├── users/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # ユーザープロフィール
│   │   │   ├── settings/
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx    # プロフィール編集
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx        # 通知一覧
│   │   │   └── layout.tsx          # メインレイアウト（ヘッダー+フッター）
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth設定
│   │   │   ├── posts/
│   │   │   │   ├── route.ts        # GET /api/posts, POST /api/posts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # GET /api/posts/[id], PUT, DELETE
│   │   │   ├── comments/
│   │   │   │   └── route.ts        # POST /api/comments
│   │   │   ├── upload/
│   │   │   │   └── route.ts        # POST /api/upload (画像アップロード)
│   │   │   └── notifications/
│   │   │       └── route.ts        # GET /api/notifications
│   │   ├── globals.css              # グローバルCSS
│   │   ├── layout.tsx               # ルートレイアウト
│   │   └── providers.tsx            # Context Providers
│   ├── components/                   # Reactコンポーネント
│   │   ├── ui/                      # shadcn/ui コンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── features/                # 機能別コンポーネント
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostEditor.tsx
│   │   │   │   └── PostDetail.tsx
│   │   │   ├── comments/
│   │   │   │   ├── CommentForm.tsx
│   │   │   │   └── CommentList.tsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   └── ProfileEditForm.tsx
│   │   │   └── notifications/
│   │   │       ├── NotificationBell.tsx
│   │   │       └── NotificationList.tsx
│   │   └── layouts/                 # レイアウトコンポーネント
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── lib/                         # ユーティリティ・ヘルパー
│   │   ├── prisma.ts               # Prismaクライアント
│   │   ├── auth.ts                 # NextAuth設定
│   │   ├── validations.ts          # Zodバリデーションスキーマ
│   │   ├── utils.ts                # 汎用ユーティリティ
│   │   ├── cloudinary.ts           # Cloudinary設定
│   │   └── constants.ts            # 定数定義
│   ├── hooks/                       # カスタムフック
│   │   ├── useAuth.ts              # 認証状態管理
│   │   ├── usePosts.ts             # 記事データフェッチ
│   │   ├── useNotifications.ts     # 通知管理
│   │   └── useToast.ts             # トースト通知
│   ├── types/                       # TypeScript型定義
│   │   ├── index.ts                # 共通型
│   │   ├── api.ts                  # APIレスポンス型
│   │   └── models.ts               # データモデル型
│   └── middleware.ts                # Next.js Middleware（認証チェック）
├── prisma/
│   ├── schema.prisma               # Prismaスキーマ定義
│   ├── seed.ts                     # シードデータ
│   └── migrations/                 # マイグレーションファイル
├── public/
│   ├── images/                     # 静的画像
│   └── favicon.ico
├── tests/                          # テストファイル
│   ├── unit/                       # 単体テスト
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── integration/                # 統合テスト
│   │   └── api/
│   └── e2e/                        # E2Eテスト (Playwright)
│       ├── auth.spec.ts
│       ├── posts.spec.ts
│       └── comments.spec.ts
├── docs/                           # ドキュメント
│   ├── templates/
│   ├── blog-requirements.md
│   ├── blog-design.md
│   └── ...
├── .env.local                      # 環境変数（gitignore）
├── .env.example                    # 環境変数サンプル
├── next.config.js                  # Next.js設定
├── tailwind.config.ts              # Tailwind設定
├── tsconfig.json                   # TypeScript設定
├── package.json
└── README.md
```

---

## コンポーネント設計

### コンポーネント分類

#### 1. UIコンポーネント（`src/components/ui/`）
shadcn/uiを使用した汎用UIパーツ。アプリケーション全体で再利用可能。

**主要コンポーネント:**
- `button.tsx` - ボタン（variant: default, destructive, outline, ghost）
- `input.tsx` - テキスト入力フィールド
- `textarea.tsx` - 複数行テキスト入力
- `card.tsx` - カード（CardHeader, CardContent, CardFooter）
- `dialog.tsx` - モーダルダイアログ
- `toast.tsx` - トースト通知
- `avatar.tsx` - ユーザーアバター
- `badge.tsx` - タグバッジ
- `dropdown-menu.tsx` - ドロップダウンメニュー
- `skeleton.tsx` - ローディングスケルトン

#### 2. 機能コンポーネント（`src/components/features/`）
特定の機能に紐づくコンポーネント。

**認証関連 (`auth/`):**
- `LoginForm.tsx` - ログインフォーム（React Hook Form + Zod）
- `RegisterForm.tsx` - 新規登録フォーム

**記事関連 (`posts/`):**
- `PostCard.tsx` - 記事カード（一覧表示用）
- `PostList.tsx` - 記事リスト + ページネーション
- `PostEditor.tsx` - マークダウンエディタ（SimpleMDE）
- `PostDetail.tsx` - 記事詳細表示（マークダウン→HTML変換）

**コメント関連 (`comments/`):**
- `CommentForm.tsx` - コメント投稿フォーム
- `CommentList.tsx` - コメント一覧表示

**プロフィール関連 (`profile/`):**
- `ProfileCard.tsx` - プロフィール表示カード
- `ProfileEditForm.tsx` - プロフィール編集フォーム
- `UserPostList.tsx` - ユーザーの投稿記事一覧

**通知関連 (`notifications/`):**
- `NotificationBell.tsx` - ヘッダーの通知ベル（未読件数表示）
- `NotificationList.tsx` - 通知一覧
- `NotificationItem.tsx` - 個別の通知アイテム

#### 3. レイアウトコンポーネント（`src/components/layouts/`）
ページ全体の構造を定義するコンポーネント。

- `Header.tsx` - ヘッダー（ロゴ、検索バー、ユーザーメニュー、通知ベル）
- `Footer.tsx` - フッター（著作権表示、リンク）
- `Sidebar.tsx` - サイドバー（カテゴリ、人気記事）

---

## データフロー

### 状態管理

#### グローバル状態
**使用ツール**: React Context API

**管理する状態:**
- **認証状態** (`AuthContext`): NextAuth.jsの`useSession()`で管理
- **通知** (`ToastContext`): トースト通知の表示・非表示
- **テーマ** (`ThemeContext`): ダークモード/ライトモード（将来的に実装）

#### ローカル状態
**使用ツール**: useState, useReducer

**管理する状態:**
- フォーム入力値（React Hook Form）
- モーダルの開閉状態
- ローディング状態

#### サーバー状態
**使用ツール**: Next.js Server Components + Client Componentsの組み合わせ

**データフェッチ戦略:**
- **Server Components**: 初期データフェッチ（SEO対応、初回ロード高速化）
- **Client Components**: ユーザーインタラクション後のデータフェッチ（fetch API）
- **API Routes**: POST/PUT/DELETE操作

### データフロー図

#### 記事一覧表示
```
1. ユーザーがトップページにアクセス
   ↓
2. Server Component (page.tsx) がサーバー側でデータフェッチ
   - Prismaで記事一覧を取得（公開済みのみ、ページネーション）
   ↓
3. Server Componentがデータを埋め込んだHTMLを生成
   ↓
4. クライアントに送信（初回ロード高速）
   ↓
5. Client Component (PostList.tsx) でページネーション操作
   - /api/posts?page=2 をフェッチ
   ↓
6. UIを更新
```

#### 記事投稿
```
1. ユーザーが記事作成フォームに入力
   ↓
2. Client Component (PostEditor.tsx) でバリデーション（Zod）
   ↓
3. POST /api/posts にリクエスト
   ↓
4. API Route (route.ts) で処理
   - セッションチェック（NextAuth）
   - バリデーション再実行
   - Prismaでデータベースに保存
   ↓
5. レスポンス返却
   ↓
6. 成功時: ダッシュボードにリダイレクト
   失敗時: エラーメッセージ表示
```

---

## ルーティング設計

### ページルート

| URL | ページ | アクセス権限 | 説明 |
|-----|--------|--------------|------|
| `/` | トップページ（記事一覧） | 全ユーザー | 公開記事の一覧を表示 |
| `/login` | ログイン | 未ログインのみ | ログインフォーム |
| `/register` | 新規登録 | 未ログインのみ | 新規登録フォーム |
| `/posts/[id]` | 記事詳細 | 全ユーザー | 記事本文とコメントを表示 |
| `/posts/new` | 記事作成 | ログイン済みのみ | 新規記事作成フォーム |
| `/posts/[id]/edit` | 記事編集 | 記事の所有者のみ | 記事編集フォーム |
| `/dashboard` | ダッシュボード | ログイン済みのみ | 自分の投稿記事一覧 |
| `/users/[id]` | ユーザープロフィール | 全ユーザー | ユーザー情報と投稿記事 |
| `/settings/profile` | プロフィール編集 | ログイン済み（本人のみ） | プロフィール編集フォーム |
| `/notifications` | 通知一覧 | ログイン済みのみ | 通知の一覧 |

### APIルート

| エンドポイント | メソッド | 説明 | 認証 |
|---------------|---------|------|------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth認証 | - |
| `/api/posts` | GET | 記事一覧取得（ページネーション、検索） | 不要 |
| `/api/posts` | POST | 記事作成 | 必要 |
| `/api/posts/[id]` | GET | 記事詳細取得 | 不要 |
| `/api/posts/[id]` | PUT | 記事更新 | 必要（所有者のみ） |
| `/api/posts/[id]` | DELETE | 記事削除 | 必要（所有者のみ） |
| `/api/comments` | POST | コメント投稿 | 必要 |
| `/api/comments/[id]` | DELETE | コメント削除 | 必要（所有者のみ） |
| `/api/upload` | POST | 画像アップロード（Cloudinary） | 必要 |
| `/api/notifications` | GET | 通知一覧取得 | 必要 |
| `/api/notifications/[id]` | PATCH | 通知を既読にする | 必要 |

### Middleware による認証チェック

`src/middleware.ts` で認証が必要なルートを保護：

```typescript
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/posts/new",
    "/posts/:id/edit",
    "/settings/:path*",
    "/notifications",
    "/api/posts",      // POST
    "/api/comments",   // POST
    "/api/upload",
  ]
}
```

---

## セキュリティ設計

### 認証・認可

#### NextAuth.js設定
- **Provider**: Credentials Provider（メールアドレス + パスワード）
- **セッション**: JWT（有効期限: 7日間）
- **パスワードハッシュ化**: bcrypt（saltRounds: 10）

#### 認可フロー
```
1. ユーザーがログインフォーム送信
   ↓
2. POST /api/auth/callback/credentials
   ↓
3. NextAuth.jsが認証情報を検証
   - Prismaでユーザーを取得
   - bcrypt.compare()でパスワード照合
   ↓
4. 成功時: JWTトークン生成 + Cookie設定
   失敗時: エラーメッセージ
   ↓
5. セッション情報をクライアントに返却
```

#### ロールベースアクセス制御（RBAC）
- **USER**: 一般ユーザー（記事投稿、コメント可能）
- **ADMIN**: 管理者（全記事の編集・削除可能）

### セキュリティ対策

#### 1. CSRF対策
- **実装**: NextAuth.jsの組み込み機能（CSRFトークン自動生成）

#### 2. XSS対策
- **React自動エスケープ**: JSX内のテキストは自動エスケープ
- **DOMPurify**: マークダウンをHTMLに変換後、サニタイズ
```typescript
import DOMPurify from 'isomorphic-dompurify'
const cleanHTML = DOMPurify.sanitize(markdownToHTML(content))
```

#### 3. SQL Injection対策
- **Prismaのパラメータ化クエリ**: 全クエリで使用
```typescript
// 安全
const post = await prisma.post.findUnique({ where: { id } })
```

#### 4. レートリミット
- **API Routes**: Next.js Middlewareでリクエスト数制限
- **ログイン**: 5回失敗で15分間ロック

#### 5. ファイルアップロード
- **ファイル形式検証**: MIMEタイプチェック（JPEG, PNG, WebP, GIF）
- **ファイルサイズ制限**: 5MB（記事画像）、2MB（プロフィール画像）
- **Cloudinary**: サーバー側でアップロード処理

---

## エラーハンドリング

### エラー種別

#### 1. バリデーションエラー（400 Bad Request）
- クライアント側: Zodでバリデーション → エラーメッセージ表示
- サーバー側: API RouteでZod再検証 → 400レスポンス

#### 2. 認証エラー（401 Unauthorized）
- 未ログイン状態で保護されたページにアクセス
- Middlewareがログインページにリダイレクト

#### 3. 認可エラー（403 Forbidden）
- 他人の記事を編集しようとした場合
- API Routeで所有者チェック → 403レスポンス

#### 4. Not Foundエラー（404）
- 存在しない記事IDにアクセス
- Next.js App Routerの`not-found.tsx`で表示

#### 5. サーバーエラー（500 Internal Server Error）
- データベース接続エラー
- 予期しない例外
- `error.tsx`でエラーバウンダリ表示

### エラーハンドリング実装

#### API Routeの例
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // バリデーション
    const body = await request.json()
    const schema = z.object({
      title: z.string().min(1).max(100),
      content: z.string().min(1).max(50000),
    })
    const validated = schema.parse(body)

    // データ保存
    const post = await prisma.post.create({
      data: {
        ...validated,
        authorId: session.user.id,
      }
    })

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

---

## パフォーマンス最適化

### 1. Next.js Server Components
- 初回ロードを高速化
- SEO対応（サーバー側でHTMLを生成）

### 2. 画像最適化
- `next/image` コンポーネント使用
- 自動WebP変換、遅延読み込み

### 3. コード分割
- ダイナミックインポート
```typescript
const MarkdownEditor = dynamic(() => import('@/components/features/posts/MarkdownEditor'), {
  ssr: false,
  loading: () => <Skeleton />
})
```

### 4. データベースクエリ最適化
- **Eager Loading**: `include`でリレーションを一度に取得
```typescript
const posts = await prisma.post.findMany({
  include: {
    author: { select: { id: true, name: true, image: true } },
    _count: { select: { comments: true } }
  }
})
```
- **インデックス**: 検索頻度の高いフィールドにインデックス作成

### 5. キャッシング
- Next.js自動キャッシュ（fetch）
- Prismaクエリ結果のキャッシュ（Redis - 将来的に）

---

## テスト戦略

### 1. 単体テスト（Vitest + Testing Library）
- **対象**: コンポーネント、ユーティリティ関数、カスタムフック
- **カバレッジ目標**: 80%以上

### 2. 統合テスト（Vitest）
- **対象**: API Routes
- **モック**: Prisma、NextAuth

### 3. E2Eテスト（Playwright）
- **対象**: 主要なユーザーフロー
  - ユーザー登録 → ログイン → 記事投稿 → コメント
  - 記事検索 → 詳細表示
  - プロフィール編集

### 4. TDD/ATDDサイクル
- E2Eテストを先に作成（Red）
- 単体テストを作成（Red）
- 実装（Green）
- リファクタリング

---

## デプロイメント戦略

### 環境

| 環境 | URL | 用途 |
|------|-----|------|
| 開発 | `localhost:3000` | ローカル開発 |
| 本番 | `simpleblog.vercel.app` | 本番環境 |

### CI/CD パイプライン（GitHub Actions）

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linter (ESLint)
      - Run type check (TypeScript)
      - Run unit tests (Vitest)
      - Run E2E tests (Playwright)
      - Upload coverage report

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy to Vercel
```

### 環境変数

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025/12/03 | 1.0 | 初版作成 | Claude Code |
