# 設計書

## システム概要

### アーキテクチャ概要
[システム全体のアーキテクチャを記述]

例:
```
クライアント（ブラウザ）
    ↓
Next.js フロントエンド（React）
    ↓
Next.js API Routes（バックエンド）
    ↓
データベース（PostgreSQL / MongoDB）
```

---

## ディレクトリ構成

プロジェクトのディレクトリ構造を記載します。

```
project-name/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 認証グループ
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # ダッシュボードグループ
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/               # API Routes
│   │   │   ├── users/
│   │   │   └── posts/
│   │   └── layout.tsx
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # 汎用UIコンポーネント
│   │   ├── features/         # 機能別コンポーネント
│   │   └── layouts/          # レイアウトコンポーネント
│   ├── lib/                  # ユーティリティ・ヘルパー
│   │   ├── db.ts            # データベース接続
│   │   ├── auth.ts          # 認証関連
│   │   └── utils.ts         # 汎用ユーティリティ
│   ├── hooks/                # カスタムフック
│   ├── types/                # TypeScript型定義
│   └── styles/               # グローバルスタイル
├── prisma/                   # Prismaスキーマ
│   └── schema.prisma
├── public/                   # 静的ファイル
├── docs/                     # ドキュメント
└── tests/                    # テストファイル
```

---

## コンポーネント設計

### コンポーネント分類

#### 1. UIコンポーネント（`src/components/ui/`）
汎用的なUIパーツ。アプリケーション全体で再利用可能。

**例:**
- `Button.tsx` - ボタンコンポーネント
- `Input.tsx` - 入力フィールド
- `Card.tsx` - カードコンポーネント
- `Modal.tsx` - モーダルダイアログ

#### 2. 機能コンポーネント（`src/components/features/`）
特定の機能に紐づくコンポーネント。

**例:**
- `UserProfile.tsx` - ユーザープロフィール表示
- `PostList.tsx` - 投稿リスト
- `CommentForm.tsx` - コメント投稿フォーム

#### 3. レイアウトコンポーネント（`src/components/layouts/`）
ページ全体の構造を定義するコンポーネント。

**例:**
- `Header.tsx` - ヘッダー
- `Footer.tsx` - フッター
- `Sidebar.tsx` - サイドバー

---

## データフロー

### 状態管理

#### グローバル状態
**使用ツール**: [Context API / Zustand / Redux]

**管理する状態:**
- ユーザー認証状態
- テーマ設定（ダークモード/ライトモード）
- 通知・トースト

#### ローカル状態
**使用方法**: React useState

**管理する状態:**
- フォーム入力値
- モーダルの開閉状態
- ページ内の一時的なUI状態

### データ取得

#### クライアントサイド
```typescript
// カスタムフックを使用
const { data, loading, error } = useFetch('/api/posts')
```

#### サーバーサイド（Server Components）
```typescript
// Next.jsのServer Componentsで直接データ取得
async function PostList() {
  const posts = await db.post.findMany()
  return <div>{posts.map(...)}</div>
}
```

---

## ルーティング設計

### ページ一覧

| URL | 説明 | 認証 | レンダリング |
|-----|------|------|-------------|
| `/` | トップページ | 不要 | SSR/SSG |
| `/login` | ログインページ | 不要 | CSR |
| `/signup` | 新規登録ページ | 不要 | CSR |
| `/dashboard` | ダッシュボード | 必要 | SSR |
| `/posts` | 投稿一覧 | 不要 | SSR |
| `/posts/[id]` | 投稿詳細 | 不要 | SSR/SSG |
| `/settings` | 設定ページ | 必要 | CSR |

### 認証ガード

保護されたページへのアクセス制御:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect('/login')
  }
}
```

---

## セキュリティ設計

### 認証・認可

#### 認証方式
[JWT / Session / OAuth など]

#### 認可フロー
1. ユーザーがログイン
2. サーバーがトークン発行
3. クライアントがトークンを保存（Cookie / LocalStorage）
4. 以降のリクエストでトークンを送信
5. サーバーがトークンを検証

### データ検証

#### クライアントサイド
```typescript
// Zodなどのバリデーションライブラリを使用
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

#### サーバーサイド
```typescript
// APIエンドポイントでも必ず検証
export async function POST(request: Request) {
  const body = await request.json()
  const validated = schema.parse(body) // エラー時は例外をスロー
  // ...
}
```

### CSRF対策
[対策方法を記述]

### XSS対策
- ユーザー入力は常にエスケープ
- dangerouslySetInnerHTMLは使用しない
- Content Security Policyを設定

---

## エラーハンドリング

### クライアントサイド

#### エラー種別
1. **バリデーションエラー** - フォーム入力エラー
2. **ネットワークエラー** - API通信失敗
3. **認証エラー** - トークン期限切れなど
4. **予期しないエラー** - システムエラー

#### エラー表示
```typescript
// トースト通知でエラーメッセージを表示
toast.error('エラーが発生しました')

// フォーム内でエラーメッセージを表示
<Input error={errors.email?.message} />
```

### サーバーサイド

#### エラーレスポンス形式
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容にエラーがあります",
    "details": [
      { "field": "email", "message": "メールアドレスの形式が正しくありません" }
    ]
  }
}
```

#### ログ記録
- エラーは必ずログに記録
- 重大なエラーは通知（開発環境のみ）

---

## パフォーマンス最適化

### コード分割
```typescript
// 動的インポートで必要なときだけ読み込む
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### 画像最適化
```typescript
// Next.js Imageコンポーネントを使用
<Image
  src="/image.jpg"
  alt="説明"
  width={500}
  height={300}
  loading="lazy"
/>
```

### キャッシュ戦略
- **静的コンテンツ**: ISR（Incremental Static Regeneration）
- **動的コンテンツ**: SWR（Stale-While-Revalidate）
- **APIレスポンス**: Redis / In-Memory Cache

---

## テスト戦略

### 単体テスト（Unit Test）
- **対象**: ユーティリティ関数、カスタムフック
- **ツール**: Vitest / Jest
- **カバレッジ目標**: 80%以上

### 統合テスト（Integration Test）
- **対象**: APIエンドポイント、データベース操作
- **ツール**: Vitest / Supertest

### E2Eテスト（End-to-End Test）
- **対象**: 主要なユーザーフロー
- **ツール**: Playwright / Cypress

### テスト例
```typescript
// コンポーネントのテスト
describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})

// APIのテスト
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    })
    expect(response.status).toBe(201)
  })
})
```

---

## デプロイ戦略

### 環境

| 環境 | 用途 | URL |
|------|------|-----|
| Development | 開発環境 | localhost:3000 |
| Staging | テスト環境 | staging.example.com |
| Production | 本番環境 | example.com |

### CI/CDパイプライン

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test:
    - run: npm test

  build:
    - run: npm run build

  deploy:
    - run: vercel deploy --prod
```

### 環境変数
```bash
# .env.local
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| YYYY/MM/DD | 1.0 | 初版作成 | [名前] |
