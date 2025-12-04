# テスト設計書 - SimpleBlog

## プロジェクト概要

### プロジェクト名
SimpleBlog - 学習用ブログプラットフォーム

### テスト対象機能
SimpleBlogアプリケーションの全機能

### 関連ドキュメント
- [要件定義書](./blog-requirements.md)
- [システム設計書](./blog-design.md)
- [API設計書](./blog-api-design.md)
- [UI設計書](./blog-ui-design.md)
- [テスト計画書](./templates/test-plan.md)

---

## テスト設計の目的

SimpleBlogの各機能が要件通りに動作することを確認し、品質を保証するための詳細なテストケースを定義します。

**目標:**
- 要件カバレッジ 100%
- 主要機能の境界値テスト網羅
- セキュリティ脆弱性の検証
- ATDD/TDDサイクルの実現

---

## テスト観点

### 機能要件のテスト観点

**テスト観点:**
- ✅ **正常系**: 期待通りの入力で正しく動作するか
- ✅ **異常系**: 不正な入力で適切にエラー処理されるか
- ✅ **境界値**: 最小値・最大値で正しく動作するか
- ✅ **エッジケース**: 特殊なケース(空文字、NULL、特殊文字)で動作するか
- ✅ **権限**: 認証・認可が正しく機能するか

### 非機能要件のテスト観点

**テスト観点:**
- ✅ **パフォーマンス**: ページロード2秒以内、APIレスポンス500ms以内
- ✅ **セキュリティ**: XSS, SQL Injection, CSRF対策
- ✅ **ユーザビリティ**: エラーメッセージの明確性、UIの直感性
- ✅ **アクセシビリティ**: WCAG 2.1 AA準拠
- ✅ **ブラウザ互換性**: Chrome, Firefox, Safari, Edge

---

## テスト技法

### 同値分割法

入力値を同じ結果になるグループに分割してテストします。

**例: パスワードのバリデーション**

| グループ | 入力値の範囲 | 期待結果 | テスト値 |
|---------|------------|---------|---------|
| 無効(空文字) | "" | エラー | "" |
| 無効(短すぎる) | 1-7文字 | エラー | "Pass1" (5文字) |
| 有効 | 8-128文字 | 成功 | "Password123" (11文字) |
| 無効(長すぎる) | 129文字以上 | エラー | 129文字の文字列 |

### 境界値分析

境界値とその前後の値をテストします。

**例: タイトルのバリデーション(最大100文字)**

| テスト値 | 期待結果 | 理由 |
|---------|---------|------|
| "" (0文字) | エラー | 下限境界(無効) |
| "A" (1文字) | 成功 | 下限境界+1(有効最小) |
| 99文字 | 成功 | 上限境界-1 |
| 100文字 | 成功 | 上限境界(有効最大) |
| 101文字 | エラー | 上限境界+1(無効) |

### デシジョンテーブル

複数の条件の組み合わせをテストします。

**例: 記事編集権限チェック**

| No | ログイン状態 | 記事の所有者 | 管理者権限 | 期待結果 |
|----|------------|------------|-----------|---------|
| 1 | ✅ ログイン済み | ✅ 所有者 | - | 編集可能 |
| 2 | ✅ ログイン済み | ❌ 所有者でない | ✅ 管理者 | 編集可能 |
| 3 | ✅ ログイン済み | ❌ 所有者でない | ❌ 一般ユーザー | 403 Forbidden |
| 4 | ❌ 未ログイン | - | - | 401 Unauthorized |

### 状態遷移テスト

**例: 記事の状態遷移**

```
下書き ──公開──> 公開中 ──非公開──> 非公開
  │                 │
  └──削除──> 削除済  └──削除──> 削除済
```

| 現在の状態 | アクション | 次の状態 | 期待結果 |
|----------|----------|---------|---------|
| 下書き | 公開 | 公開中 | published=true |
| 下書き | 削除 | 削除済 | レコード削除 |
| 公開中 | 非公開 | 非公開 | published=false |
| 公開中 | 削除 | 削除済 | レコード削除 |
| 非公開 | 公開 | 公開中 | published=true |

---

## E2Eテストケース（ATDD）

### 1. ユーザー登録機能

#### TC-001: 正常系 - 有効な情報で新規登録

**優先度:** P0 (Critical)

**前提条件:**
- ユーザーが未登録
- 登録ページ(`/register`)にアクセス済み

**テスト手順:**
1. `email-input` (data-testid="email-input") に "user@example.com" を入力
2. `username-input` (data-testid="username-input") に "johndoe" を入力
3. `name-input` (data-testid="name-input") に "John Doe" を入力
4. `password-input` (data-testid="password-input") に "Password123" を入力
5. `password-confirm-input` (data-testid="password-confirm-input") に "Password123" を入力
6. `register-button` (data-testid="register-button") をクリック

**期待結果:**
- ✅ アカウントが作成される (DBに保存)
- ✅ `success-message` (data-testid="success-message") が表示される
- ✅ ログイン状態になる (セッションCookieが設定される)
- ✅ トップページ(`/`)にリダイレクトされる

---

#### TC-002: 異常系 - メールアドレスが不正な形式

**優先度:** P1 (High)

**前提条件:**
- 登録ページにアクセス済み

**テスト手順:**
1. `email-input` に "invalid-email" を入力
2. `username-input` に "johndoe" を入力
3. `name-input` に "John Doe" を入力
4. `password-input` に "Password123" を入力
5. `password-confirm-input` に "Password123" を入力
6. `register-button` をクリック

**期待結果:**
- ❌ アカウントは作成されない
- ✅ `error-message` (data-testid="error-message") に "有効なメールアドレスを入力してください" が表示される
- ✅ `email-input` がフォーカスされる
- ✅ `email-input` にaria-invalid="true"が設定される

---

#### TC-003: 異常系 - パスワードが短すぎる

**優先度:** P1 (High)

**テスト手順:**
1. `email-input` に "user@example.com" を入力
2. `username-input` に "johndoe" を入力
3. `name-input` に "John Doe" を入力
4. `password-input` に "Pass1" (5文字) を入力
5. `register-button` をクリック

**期待結果:**
- ❌ アカウントは作成されない
- ✅ `error-message` に "パスワードは8文字以上で入力してください" が表示される

---

#### TC-004: 異常系 - 既に登録済みのメールアドレス

**優先度:** P1 (High)

**前提条件:**
- user@example.com で既に登録済み

**テスト手順:**
1. `email-input` に "user@example.com" を入力
2. `username-input` に "johndoe2" を入力
3. `name-input` に "John Doe" を入力
4. `password-input` に "Password123" を入力
5. `register-button` をクリック

**期待結果:**
- ❌ アカウントは作成されない
- ✅ `error-message` に "このメールアドレスは既に登録されています" が表示される

---

#### TC-005: 境界値 - メールアドレス最大文字数(254文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `email-input` に 254文字のメールアドレス (例: "a"を240回 + "@example.com") を入力
2. その他の項目を有効な値で入力
3. `register-button` をクリック

**期待結果:**
- ✅ アカウントが作成される

---

#### TC-006: 境界値 - メールアドレス最大文字数超過(255文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `email-input` に 255文字のメールアドレスを入力
2. その他の項目を有効な値で入力
3. `register-button` をクリック

**期待結果:**
- ❌ アカウントは作成されない
- ✅ `error-message` にエラーメッセージが表示される

---

#### TC-007: 境界値 - パスワード最小文字数(8文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. 有効な情報を入力
2. `password-input` に "Pass123!" (8文字) を入力
3. `register-button` をクリック

**期待結果:**
- ✅ アカウントが作成される

---

#### TC-008: 境界値 - ユーザー名最小文字数(2文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. 有効な情報を入力
2. `username-input` に "ab" (2文字) を入力
3. `register-button` をクリック

**期待結果:**
- ✅ アカウントが作成される

---

#### TC-009: 境界値 - ユーザー名最大文字数(30文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. 有効な情報を入力
2. `username-input` に 30文字のユーザー名を入力
3. `register-button` をクリック

**期待結果:**
- ✅ アカウントが作成される

---

#### TC-010: 境界値 - ユーザー名最大文字数超過(31文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. 有効な情報を入力
2. `username-input` に 31文字のユーザー名を入力
3. `register-button` をクリック

**期待結果:**
- ❌ アカウントは作成されない
- ✅ エラーメッセージが表示される

---

### 2. ログイン機能

#### TC-011: 正常系 - 有効な認証情報でログイン

**優先度:** P0 (Critical)

**前提条件:**
- user@example.com / Password123 で登録済み
- ログアウト状態
- ログインページ(`/login`)にアクセス済み

**テスト手順:**
1. `email-input` (data-testid="email-input") に "user@example.com" を入力
2. `password-input` (data-testid="password-input") に "Password123" を入力
3. `login-button` (data-testid="login-button") をクリック

**期待結果:**
- ✅ ログインに成功する
- ✅ セッションCookieが設定される
- ✅ トップページ(`/`)にリダイレクトされる
- ✅ ヘッダーに `user-menu-button` (data-testid="user-menu-button") が表示される

---

#### TC-012: 異常系 - パスワードが間違っている

**優先度:** P1 (High)

**テスト手順:**
1. `email-input` に "user@example.com" を入力
2. `password-input` に "WrongPassword" を入力
3. `login-button` をクリック

**期待結果:**
- ❌ ログインできない
- ✅ `error-message` (data-testid="error-message") に "メールアドレスまたはパスワードが正しくありません" が表示される
- ✅ ログインページに留まる

---

#### TC-013: 異常系 - 存在しないメールアドレス

**優先度:** P1 (High)

**テスト手順:**
1. `email-input` に "nonexistent@example.com" を入力
2. `password-input` に "Password123" を入力
3. `login-button` をクリック

**期待結果:**
- ❌ ログインできない
- ✅ `error-message` に "メールアドレスまたはパスワードが正しくありません" が表示される
- ✅ セキュリティ上、存在しないことを明示しない

---

#### TC-014: UI - パスワード表示切り替え

**優先度:** P2 (Medium)

**テスト手順:**
1. `password-input` に "Password123" を入力
2. `password-toggle` (data-testid="password-toggle") をクリック

**期待結果:**
- ✅ パスワードが平文で表示される (type="text")
- ✅ もう一度クリックすると隠れる (type="password")

---

### 3. 記事投稿機能

#### TC-101: 正常系 - 有効な情報で記事を作成

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み
- 新規記事作成ページ(`/posts/new`)にアクセス済み

**テスト手順:**
1. `title-input` (data-testid="title-input") に "テスト記事のタイトル" を入力
2. `content-editor` (data-testid="content-editor") に "# 見出し\n\nこれはテスト記事です" を入力
3. `publish-button` (data-testid="publish-button") をクリック

**期待結果:**
- ✅ 記事が作成される (DBに保存)
- ✅ `success-message` に "記事を公開しました" が表示される
- ✅ 記事詳細ページ(`/posts/{id}`)にリダイレクトされる
- ✅ 作成した記事の内容が表示される
- ✅ Markdownが正しくHTMLに変換される

---

#### TC-102: 正常系 - 下書きとして保存

**優先度:** P0 (Critical)

**テスト手順:**
1. `title-input` に "下書き記事" を入力
2. `content-editor` に "下書きの内容" を入力
3. `save-draft-button` (data-testid="save-draft-button") をクリック

**期待結果:**
- ✅ 記事が下書きとして保存される (published=false)
- ✅ `success-message` に "下書きを保存しました" が表示される
- ✅ ダッシュボード(`/dashboard`)にリダイレクトされる
- ✅ 記事一覧(`/`)には表示されない

---

#### TC-103: 異常系 - タイトルが空

**優先度:** P1 (High)

**テスト手順:**
1. `title-input` を空のままにする
2. `content-editor` に "本文" を入力
3. `publish-button` をクリック

**期待結果:**
- ❌ 記事は作成されない
- ✅ `error-message` に "タイトルを入力してください" が表示される
- ✅ `title-input` がフォーカスされる

---

#### TC-104: 異常系 - 本文が空

**優先度:** P1 (High)

**テスト手順:**
1. `title-input` に "タイトル" を入力
2. `content-editor` を空のままにする
3. `publish-button` をクリック

**期待結果:**
- ❌ 記事は作成されない
- ✅ `error-message` に "本文を入力してください" が表示される

---

#### TC-105: 境界値 - タイトル最大文字数(100文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `title-input` に 100文字のタイトルを入力
2. `content-editor` に "本文" を入力
3. `publish-button` をクリック

**期待結果:**
- ✅ 記事が作成される
- ✅ タイトルが完全に保存される

---

#### TC-106: 境界値 - タイトル最大文字数超過(101文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `title-input` に 101文字のタイトルを入力
2. `content-editor` に "本文" を入力
3. `publish-button` をクリック

**期待結果:**
- ❌ 記事は作成されない
- ✅ `error-message` に "タイトルは100文字以内で入力してください" が表示される

---

#### TC-107: 境界値 - 本文最大文字数(50,000文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `title-input` に "タイトル" を入力
2. `content-editor` に 50,000文字の本文を入力
3. `publish-button` をクリック

**期待結果:**
- ✅ 記事が作成される

---

#### TC-108: 正常系 - アイキャッチ画像をアップロード

**優先度:** P1 (High)

**テスト手順:**
1. `title-input` に "画像付き記事" を入力
2. `content-editor` に "本文" を入力
3. `cover-image-upload` (data-testid="cover-image-upload") から有効な画像(JPEG, 2MB)を選択
4. `publish-button` をクリック

**期待結果:**
- ✅ 記事が作成される
- ✅ 画像がアップロードされる (Cloudinary or ローカル保存)
- ✅ 記事詳細ページで画像が表示される

---

#### TC-109: 異常系 - アイキャッチ画像サイズ超過(5MB超)

**優先度:** P1 (High)

**テスト手順:**
1. `title-input` に "タイトル" を入力
2. `content-editor` に "本文" を入力
3. `cover-image-upload` から 6MBの画像を選択

**期待結果:**
- ✅ `error-message` に "画像サイズは5MB以下にしてください" が表示される
- ❌ 画像はアップロードされない

---

#### TC-110: 異常系 - アイキャッチ画像形式が不正(PDF)

**優先度:** P1 (High)

**テスト手順:**
1. `cover-image-upload` から PDFファイルを選択

**期待結果:**
- ✅ `error-message` に "JPEG、PNG、WebP、GIF形式の画像をアップロードしてください" が表示される
- ❌ ファイルはアップロードされない

---

#### TC-111: 正常系 - タグを追加

**優先度:** P1 (High)

**テスト手順:**
1. `title-input` に "タイトル" を入力
2. `content-editor` に "本文" を入力
3. `tag-input` (data-testid="tag-input") に "React" を入力
4. `add-tag-button` (data-testid="add-tag-button") をクリック
5. 同様に "Next.js", "TypeScript" を追加
6. `publish-button` をクリック

**期待結果:**
- ✅ 記事が作成される
- ✅ 3つのタグが関連付けられる
- ✅ 記事詳細ページでタグが表示される

---

#### TC-112: 異常系 - タグ個数超過(6個以上)

**優先度:** P2 (Medium)

**テスト手順:**
1. `title-input` に "タイトル" を入力
2. `content-editor` に "本文" を入力
3. 5つのタグを追加
4. 6つ目のタグを追加しようとする

**期待結果:**
- ✅ `error-message` に "タグは最大5個まで設定できます" が表示される
- ❌ 6つ目のタグは追加されない
- ✅ `add-tag-button` が無効化される

---

#### TC-113: 境界値 - タグ名最大文字数(20文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `tag-input` に 20文字のタグ名を入力
2. `add-tag-button` をクリック

**期待結果:**
- ✅ タグが追加される

---

#### TC-114: 境界値 - タグ名最大文字数超過(21文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `tag-input` に 21文字のタグ名を入力
2. `add-tag-button` をクリック

**期待結果:**
- ✅ `error-message` に "タグは20文字以内で入力してください" が表示される
- ❌ タグは追加されない

---

### 4. 記事編集・削除機能

#### TC-115: 正常系 - 自分の記事を編集

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み
- 自分の記事が存在する

**テスト手順:**
1. 記事詳細ページ(`/posts/{id}`)にアクセス
2. `edit-button` (data-testid="edit-button") をクリック
3. 編集ページ(`/posts/{id}/edit`)に遷移
4. `title-input` を "編集後のタイトル" に変更
5. `save-button` (data-testid="save-button") をクリック

**期待結果:**
- ✅ 記事が更新される
- ✅ `success-message` に "記事を更新しました" が表示される
- ✅ 記事詳細ページにリダイレクトされる
- ✅ 変更が反映されている

---

#### TC-116: 権限 - 他人の記事編集を試みる

**優先度:** P0 (Critical)

**前提条件:**
- ユーザーA でログイン済み
- ユーザーB の記事が存在する

**テスト手順:**
1. ユーザーB の記事詳細ページにアクセス
2. URLを直接変更して編集ページ(`/posts/{id}/edit`)にアクセス

**期待結果:**
- ❌ 編集ページにアクセスできない
- ✅ 403 Forbidden エラーページが表示される
- ✅ または記事詳細ページにリダイレクトされ、エラーメッセージが表示される

---

#### TC-117: 正常系 - 自分の記事を削除

**優先度:** P0 (Critical)

**テスト手順:**
1. 記事詳細ページにアクセス
2. `delete-button` (data-testid="delete-button") をクリック
3. 確認ダイアログで `confirm-delete-button` (data-testid="confirm-delete-button") をクリック

**期待結果:**
- ✅ 記事が削除される (DBから削除)
- ✅ ダッシュボード(`/dashboard`)にリダイレクトされる
- ✅ `success-message` に "記事を削除しました" が表示される
- ✅ 記事一覧から消える

---

#### TC-118: UI - 削除確認ダイアログ

**優先度:** P1 (High)

**テスト手順:**
1. 記事詳細ページにアクセス
2. `delete-button` をクリック
3. 確認ダイアログで `cancel-delete-button` (data-testid="cancel-delete-button") をクリック

**期待結果:**
- ✅ ダイアログが閉じる
- ❌ 記事は削除されない
- ✅ 記事詳細ページに留まる

---

#### TC-119: 正常系 - 公開状態を下書きに変更

**優先度:** P1 (High)

**テスト手順:**
1. 公開済み記事の編集ページにアクセス
2. `unpublish-button` (data-testid="unpublish-button") をクリック

**期待結果:**
- ✅ 記事のpublished状態がfalseになる
- ✅ 記事一覧から消える
- ✅ ダッシュボードの下書き一覧に表示される

---

### 5. 記事閲覧機能

#### TC-120: 正常系 - 公開記事一覧を表示

**優先度:** P0 (Critical)

**前提条件:**
- 公開記事が15件存在する

**テスト手順:**
1. トップページ(`/`)にアクセス

**期待結果:**
- ✅ `post-list` (data-testid="post-list") に記事カードが表示される
- ✅ 1ページに10件表示される
- ✅ 各記事カードに以下が表示される:
  - `post-cover-{id}` (アイキャッチ画像)
  - `post-title-{id}` (タイトル)
  - `post-excerpt-{id}` (抜粋)
  - `post-author-{id}` (著者名)
  - `post-date-{id}` (投稿日時)
  - タグ
- ✅ `pagination` (data-testid="pagination") が表示される

---

#### TC-121: 正常系 - ページネーション

**優先度:** P1 (High)

**テスト手順:**
1. トップページにアクセス
2. `pagination-next` (data-testid="pagination-next") をクリック

**期待結果:**
- ✅ 2ページ目の記事が表示される
- ✅ URLが `/?page=2` になる
- ✅ 残りの5件の記事が表示される

---

#### TC-122: 正常系 - 記事詳細を表示

**優先度:** P0 (Critical)

**テスト手順:**
1. トップページで記事カード (`post-card-{id}`) をクリック
2. 記事詳細ページ(`/posts/{id}`)に遷移

**期待結果:**
- ✅ `post-detail-page` (data-testid="post-detail-page") が表示される
- ✅ `post-title` (data-testid="post-title") にタイトルが表示される
- ✅ `post-content` (data-testid="post-content") にMarkdownがHTMLに変換されて表示される
- ✅ `post-author` (data-testid="post-author") に著者名が表示される
- ✅ `post-date` (data-testid="post-date") に投稿日時が表示される
- ✅ コメント一覧が表示される

---

#### TC-123: 正常系 - タグで記事をフィルタリング

**優先度:** P1 (High)

**テスト手順:**
1. トップページで `post-tag-{tagSlug}` (data-testid="post-tag-react") をクリック

**期待結果:**
- ✅ URLが `/posts?tag=react` になる
- ✅ "React"タグの付いた記事のみが表示される
- ✅ フィルター表示バッジが表示される

---

### 6. コメント機能

#### TC-201: 正常系 - 記事にコメントを投稿

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み
- 記事詳細ページにアクセス済み

**テスト手順:**
1. `comment-input` (data-testid="comment-input") に "素晴らしい記事ですね!" を入力
2. `comment-submit-button` (data-testid="comment-submit-button") をクリック

**期待結果:**
- ✅ コメントが投稿される (DBに保存)
- ✅ `comment-list` (data-testid="comment-list") にコメントが追加表示される
- ✅ `comment-input` がクリアされる
- ✅ コメント投稿者に自分の名前が表示される
- ✅ 投稿時刻が表示される

---

#### TC-202: 異常系 - コメントが空

**優先度:** P1 (High)

**テスト手順:**
1. `comment-input` を空のままにする
2. `comment-submit-button` をクリック

**期待結果:**
- ❌ コメントは投稿されない
- ✅ `error-message` に "コメントを入力してください" が表示される

---

#### TC-203: 境界値 - コメント最大文字数(1,000文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `comment-input` に 1,000文字のコメントを入力
2. `comment-submit-button` をクリック

**期待結果:**
- ✅ コメントが投稿される

---

#### TC-204: 境界値 - コメント最大文字数超過(1,001文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `comment-input` に 1,001文字のコメントを入力
2. `comment-submit-button` をクリック

**期待結果:**
- ❌ コメントは投稿されない
- ✅ `error-message` に "コメントは1,000文字以内で入力してください" が表示される

---

#### TC-205: 権限 - 未ログインでコメント投稿を試みる

**優先度:** P1 (High)

**前提条件:**
- ログアウト状態

**テスト手順:**
1. 記事詳細ページにアクセス

**期待結果:**
- ✅ `comment-form` が表示されない
- ✅ "コメントするにはログインしてください" メッセージが表示される
- ✅ `login-prompt-button` (data-testid="login-prompt-button") が表示される

---

#### TC-206: 正常系 - 自分のコメントを削除

**優先度:** P1 (High)

**前提条件:**
- ログイン済み
- 自分のコメントが存在する

**テスト手順:**
1. 記事詳細ページにアクセス
2. 自分のコメントの `delete-comment-button-{id}` (data-testid="delete-comment-button-{id}") をクリック
3. 確認ダイアログで `confirm-delete-comment-button` をクリック

**期待結果:**
- ✅ コメントが削除される
- ✅ `comment-list` から消える
- ✅ コメント数が減る

---

#### TC-207: 権限 - 他人のコメントに削除ボタンが表示されない

**優先度:** P1 (High)

**テスト手順:**
1. 他人のコメントを確認

**期待結果:**
- ✅ 他人のコメントには `delete-comment-button` が表示されない
- ✅ 自分のコメントのみ削除ボタンが表示される

---

### 7. ユーザープロフィール機能

#### TC-301: 正常系 - プロフィールを表示

**優先度:** P1 (High)

**テスト手順:**
1. ヘッダーの `user-menu-button` をクリック
2. `profile-link` (data-testid="profile-link") をクリック

**期待結果:**
- ✅ プロフィールページ(`/profile`)に遷移
- ✅ `profile-page` (data-testid="profile-page") が表示される
- ✅ `profile-image` (data-testid="profile-image") にプロフィール画像が表示される
- ✅ `profile-name` (data-testid="profile-name") にユーザー名が表示される
- ✅ `profile-bio` (data-testid="profile-bio") に自己紹介が表示される
- ✅ `profile-posts` (data-testid="profile-posts") に自分の投稿記事一覧が表示される

---

#### TC-302: 正常系 - プロフィールを編集

**優先度:** P1 (High)

**テスト手順:**
1. プロフィールページで `edit-profile-button` (data-testid="edit-profile-button") をクリック
2. `name-input` (data-testid="name-input") を "新しい名前" に変更
3. `bio-textarea` (data-testid="bio-textarea") に "新しい自己紹介" を入力
4. `save-profile-button` (data-testid="save-profile-button") をクリック

**期待結果:**
- ✅ プロフィールが更新される
- ✅ `success-message` に "プロフィールを更新しました" が表示される
- ✅ プロフィールページにリダイレクトされる
- ✅ 変更が反映されている

---

#### TC-303: 正常系 - プロフィール画像をアップロード

**優先度:** P1 (High)

**テスト手順:**
1. プロフィール編集ページで `profile-image-upload` (data-testid="profile-image-upload") から画像を選択
2. `save-profile-button` をクリック

**期待結果:**
- ✅ プロフィール画像が更新される
- ✅ ヘッダーのアバター画像も更新される

---

#### TC-304: 異常系 - プロフィール画像サイズ超過(2MB超)

**優先度:** P1 (High)

**テスト手順:**
1. `profile-image-upload` から 3MBの画像を選択

**期待結果:**
- ✅ `error-message` に "画像サイズは2MB以下にしてください" が表示される
- ❌ 画像はアップロードされない

---

#### TC-305: 境界値 - 自己紹介最大文字数(500文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `bio-textarea` に 500文字の自己紹介を入力
2. `save-profile-button` をクリック

**期待結果:**
- ✅ プロフィールが更新される

---

#### TC-306: 境界値 - 自己紹介最大文字数超過(501文字)

**優先度:** P2 (Medium)

**テスト手順:**
1. `bio-textarea` に 501文字の自己紹介を入力
2. `save-profile-button` をクリック

**期待結果:**
- ❌ プロフィールは更新されない
- ✅ `error-message` に "自己紹介は500文字以内で入力してください" が表示される

---

### 8. 検索・フィルタリング機能

#### TC-401: 正常系 - キーワードで記事を検索

**優先度:** P1 (High)

**テスト手順:**
1. ヘッダーの `search-input` (data-testid="search-input") に "React" を入力
2. `search-button` (data-testid="search-button") をクリック

**期待結果:**
- ✅ 検索結果ページ(`/search?q=React`)に遷移
- ✅ `search-results` (data-testid="search-results") に "React" を含む記事が表示される
- ✅ 検索ワードがハイライトされる
- ✅ マッチしない記事は表示されない

---

#### TC-402: 正常系 - 検索結果が0件

**優先度:** P2 (Medium)

**テスト手順:**
1. `search-input` に存在しないキーワード "zzzzzzzzz" を入力
2. `search-button` をクリック

**期待結果:**
- ✅ `search-results` に "該当する記事が見つかりませんでした" が表示される
- ✅ `empty-state` (data-testid="empty-state") が表示される

---

#### TC-403: 正常系 - タグと検索を組み合わせる

**優先度:** P2 (Medium)

**テスト手順:**
1. `search-input` に "Next.js" を入力
2. `search-button` をクリック
3. `tag-filter-react` (data-testid="tag-filter-react") をクリック

**期待結果:**
- ✅ URLが `/search?q=Next.js&tag=react` になる
- ✅ "Next.js"を含み、かつ"React"タグの付いた記事のみが表示される

---

### 9. 通知機能

#### TC-501: 正常系 - 新しいコメントで通知を受け取る

**優先度:** P1 (High)

**前提条件:**
- ユーザーA でログイン済み
- ユーザーA の記事が存在する
- ユーザーB が記事にコメント投稿

**テスト手順:**
1. ユーザーA としてログイン
2. ヘッダーの `notifications-button` (data-testid="notifications-button") を確認

**期待結果:**
- ✅ `notifications-badge` (data-testid="notifications-badge") に "1" が表示される (未読通知数)
- ✅ 通知がリアルタイムで表示される (ページリロード不要)

---

#### TC-502: 正常系 - 通知一覧を表示

**優先度:** P1 (High)

**テスト手順:**
1. `notifications-button` をクリック
2. `notifications-dropdown` (data-testid="notifications-dropdown") が開く

**期待結果:**
- ✅ `notification-list` (data-testid="notification-list") に通知が表示される
- ✅ 各通知に以下が含まれる:
  - `notification-item-{id}` (data-testid="notification-item-{id}")
  - 通知アイコン
  - 通知メッセージ ("○○さんがコメントしました")
  - 通知時刻
- ✅ 未読通知は背景色が異なる

---

#### TC-503: 正常系 - 通知を既読にする

**優先度:** P1 (High)

**テスト手順:**
1. `notifications-dropdown` を開く
2. `notification-item-{id}` をクリック

**期待結果:**
- ✅ 通知が既読になる
- ✅ 記事詳細ページに遷移する
- ✅ `notifications-badge` の数が減る

---

#### TC-504: 正常系 - 全ての通知を既読にする

**優先度:** P2 (Medium)

**テスト手順:**
1. `notifications-dropdown` を開く
2. `mark-all-read-button` (data-testid="mark-all-read-button") をクリック

**期待結果:**
- ✅ 全ての通知が既読になる
- ✅ `notifications-badge` が消える

---

### 10. 認証・認可テスト

#### TC-601: 権限 - 未ログインで保護ルートにアクセス

**優先度:** P0 (Critical)

**テスト手順:**
1. ログアウト状態で `/posts/new` に直接アクセス

**期待結果:**
- ✅ ログインページ(`/login`)にリダイレクトされる
- ✅ リダイレクト後のURLに `?callbackUrl=/posts/new` が含まれる
- ✅ ログイン後に元のページに戻る

---

#### TC-602: 権限 - 管理者のみのページにアクセス

**優先度:** P1 (High)

**前提条件:**
- 一般ユーザーでログイン済み

**テスト手順:**
1. 管理画面(`/admin`)に直接アクセス

**期待結果:**
- ✅ 403 Forbidden エラーページが表示される
- ✅ または トップページにリダイレクトされ、エラーメッセージが表示される

---

---

## APIテストケース

### 認証API

#### API-001: POST /api/auth/register - 正常系

**優先度:** P0 (Critical)

**リクエスト:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "name": "Test User",
  "password": "Password123"
}
```

**期待レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx123",
      "email": "test@example.com",
      "username": "testuser",
      "name": "Test User",
      "role": "USER",
      "createdAt": "2025-12-04T00:00:00.000Z"
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 201
- ✅ user.id が返される
- ✅ パスワードは含まれない
- ✅ DBにユーザーが作成される
- ✅ パスワードがbcryptでハッシュ化される

---

#### API-002: POST /api/auth/register - バリデーションエラー

**優先度:** P1 (High)

**リクエスト:**
```json
{
  "email": "invalid-email",
  "username": "a",
  "name": "",
  "password": "123"
}
```

**期待レスポンス (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "有効なメールアドレスを入力してください"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 400
- ✅ error.code: "VALIDATION_ERROR"
- ✅ 適切なエラーメッセージ

---

#### API-003: POST /api/auth/register - メールアドレス重複

**優先度:** P1 (High)

**前提条件:**
- test@example.com で既に登録済み

**リクエスト:**
```json
{
  "email": "test@example.com",
  "username": "testuser2",
  "name": "Test User 2",
  "password": "Password123"
}
```

**期待レスポンス (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "このメールアドレスは既に登録されています"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 409
- ✅ error.code: "CONFLICT"

---

### 記事API

#### API-101: GET /api/posts - 記事一覧取得

**優先度:** P0 (Critical)

**リクエスト:**
```
GET /api/posts?page=1&limit=10
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post1",
        "title": "記事タイトル",
        "slug": "post-title",
        "excerpt": "記事の抜粋...",
        "coverImage": "https://example.com/image.jpg",
        "published": true,
        "createdAt": "2025-12-04T00:00:00.000Z",
        "author": {
          "id": "user1",
          "name": "著者名",
          "image": "https://example.com/avatar.jpg"
        },
        "tags": [
          { "id": "tag1", "name": "React", "slug": "react" }
        ],
        "_count": {
          "comments": 5
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ posts配列が返される
- ✅ 最大10件まで返される
- ✅ published=true の記事のみ返される
- ✅ author情報が含まれる (N+1問題回避)
- ✅ tags情報が含まれる
- ✅ コメント数が含まれる
- ✅ paginationオブジェクトが正しい

---

#### API-102: POST /api/posts - 記事作成

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み (セッションCookie有り)

**リクエスト:**
```json
POST /api/posts
Content-Type: application/json
Cookie: next-auth.session-token={session_token}

{
  "title": "新しい記事",
  "content": "# 見出し\n\n本文",
  "published": true,
  "coverImage": "https://cloudinary.com/image.jpg",
  "tags": ["react", "nextjs"]
}
```

**期待レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "clxxx456",
      "title": "新しい記事",
      "slug": "new-article",
      "content": "# 見出し\n\n本文",
      "published": true,
      "coverImage": "https://cloudinary.com/image.jpg",
      "authorId": "clxxx123",
      "createdAt": "2025-12-04T00:00:00.000Z"
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 201
- ✅ post.id が返される
- ✅ slug が自動生成される
- ✅ authorId が現在のユーザー
- ✅ DBに記事が作成される

---

#### API-103: POST /api/posts - 未認証エラー

**優先度:** P1 (High)

**前提条件:**
- ログアウト状態 (セッションCookie無し)

**リクエスト:**
```json
POST /api/posts
Content-Type: application/json

{
  "title": "新しい記事",
  "content": "本文"
}
```

**期待レスポンス (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "ログインが必要です"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 401
- ✅ error.code: "UNAUTHORIZED"

---

#### API-104: PUT /api/posts/[id] - 記事更新

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み
- 自分の記事が存在する

**リクエスト:**
```json
PUT /api/posts/post1
Content-Type: application/json
Cookie: next-auth.session-token={session_token}

{
  "title": "更新後のタイトル",
  "content": "更新後の本文"
}
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post1",
      "title": "更新後のタイトル",
      "content": "更新後の本文",
      "updatedAt": "2025-12-04T01:00:00.000Z"
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ updatedAt が更新される
- ✅ DBの記事が更新される

---

#### API-105: PUT /api/posts/[id] - 権限不足エラー

**優先度:** P0 (Critical)

**前提条件:**
- ユーザーA でログイン済み
- ユーザーB の記事が存在する

**リクエスト:**
```json
PUT /api/posts/other-user-post
Content-Type: application/json
Cookie: next-auth.session-token={userA_session}

{
  "title": "不正な更新"
}
```

**期待レスポンス (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "この記事を編集する権限がありません"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 403
- ✅ error.code: "FORBIDDEN"
- ✅ 記事は更新されない

---

#### API-106: DELETE /api/posts/[id] - 記事削除

**優先度:** P0 (Critical)

**テスト手順:**
1. DELETE /api/posts/post1 をリクエスト

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "記事を削除しました"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ DBから記事が削除される
- ✅ 関連するコメントもCascade削除される

---

### コメントAPI

#### API-201: POST /api/comments - コメント投稿

**優先度:** P0 (Critical)

**前提条件:**
- ログイン済み

**リクエスト:**
```json
POST /api/comments
Content-Type: application/json
Cookie: next-auth.session-token={session_token}

{
  "postId": "post1",
  "content": "素晴らしい記事ですね!"
}
```

**期待レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment1",
      "postId": "post1",
      "content": "素晴らしい記事ですね!",
      "authorId": "user1",
      "createdAt": "2025-12-04T00:00:00.000Z"
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 201
- ✅ comment.id が返される
- ✅ DBにコメントが作成される

---

#### API-202: POST /api/comments - バリデーションエラー

**優先度:** P1 (High)

**リクエスト:**
```json
{
  "postId": "post1",
  "content": ""
}
```

**期待レスポンス (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "コメントを入力してください"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 400

---

#### API-203: DELETE /api/comments/[id] - コメント削除

**優先度:** P1 (High)

**テスト手順:**
1. DELETE /api/comments/comment1 をリクエスト

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "コメントを削除しました"
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ DBからコメントが削除される

---

### 通知API

#### API-301: GET /api/notifications - 通知一覧取得

**優先度:** P1 (High)

**リクエスト:**
```
GET /api/notifications
Cookie: next-auth.session-token={session_token}
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif1",
        "type": "NEW_COMMENT",
        "message": "山田太郎さんがあなたの記事にコメントしました",
        "read": false,
        "postId": "post1",
        "actorId": "user2",
        "actor": {
          "id": "user2",
          "name": "山田太郎",
          "image": "https://example.com/avatar.jpg"
        },
        "createdAt": "2025-12-04T00:00:00.000Z"
      }
    ],
    "unreadCount": 1
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ 自分宛ての通知のみ返される
- ✅ actor情報が含まれる
- ✅ unreadCount が正しい

---

#### API-302: PUT /api/notifications/[id]/read - 通知を既読にする

**優先度:** P1 (High)

**リクエスト:**
```json
PUT /api/notifications/notif1/read
Cookie: next-auth.session-token={session_token}
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif1",
      "read": true
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ read が true になる

---

### ユーザーAPI

#### API-401: GET /api/users/[username] - ユーザープロフィール取得

**優先度:** P1 (High)

**リクエスト:**
```
GET /api/users/johndoe
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user1",
      "username": "johndoe",
      "name": "John Doe",
      "bio": "自己紹介文",
      "image": "https://example.com/avatar.jpg",
      "createdAt": "2025-12-01T00:00:00.000Z",
      "_count": {
        "posts": 10
      }
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ パスワード、メールアドレスは含まれない
- ✅ 投稿数が含まれる

---

#### API-402: PUT /api/users/profile - プロフィール更新

**優先度:** P1 (High)

**リクエスト:**
```json
PUT /api/users/profile
Content-Type: application/json
Cookie: next-auth.session-token={session_token}

{
  "name": "新しい名前",
  "bio": "新しい自己紹介"
}
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user1",
      "name": "新しい名前",
      "bio": "新しい自己紹介",
      "updatedAt": "2025-12-04T01:00:00.000Z"
    }
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ DBのユーザー情報が更新される

---

### 検索API

#### API-501: GET /api/search - 記事検索

**優先度:** P1 (High)

**リクエスト:**
```
GET /api/search?q=React&tag=nextjs
```

**期待レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post1",
        "title": "React入門",
        "excerpt": "Reactの基礎...",
        "tags": [
          { "name": "React" },
          { "name": "Next.js" }
        ]
      }
    ],
    "total": 1
  }
}
```

**検証項目:**
- ✅ ステータスコード: 200
- ✅ タイトル・本文に "React" を含む記事が返される
- ✅ "Next.js" タグの付いた記事のみ返される

---

---

## パフォーマンステスト

### ページ読み込み時間

| ページ | 目標 | 許容範囲 | 測定方法 |
|--------|------|---------|---------|
| トップページ(`/`) | 2秒以内 | 3秒以内 | Lighthouse |
| 記事一覧 | 2秒以内 | 3秒以内 | Lighthouse |
| 記事詳細 | 1.5秒以内 | 2秒以内 | Lighthouse |
| ダッシュボード | 2.5秒以内 | 3秒以内 | Lighthouse |
| ログインページ | 1秒以内 | 1.5秒以内 | Lighthouse |

**測定条件:**
- Fast 3G ネットワーク
- Mobile CPU throttling (4x slowdown)

**合格基準:**
- Lighthouse Performance Score: 90以上

---

### API レスポンス時間

| エンドポイント | 目標 | 許容範囲 | 測定方法 |
|--------------|------|---------|---------|
| GET /api/posts | 300ms以内 | 500ms以内 | k6 |
| POST /api/posts | 500ms以内 | 1000ms以内 | k6 |
| GET /api/posts/[id] | 200ms以内 | 300ms以内 | k6 |
| POST /api/comments | 400ms以内 | 600ms以内 | k6 |
| GET /api/auth/session | 100ms以内 | 200ms以内 | k6 |

**負荷条件:**
- 同時接続ユーザー: 50人
- リクエスト持続時間: 30秒

**合格基準:**
- P95 (95パーセンタイル) が許容範囲内

---

### 負荷テスト

**シナリオ:**
1. 100人の同時ユーザーがトップページにアクセス
2. 50人が記事を閲覧
3. 20人が新規記事を作成
4. 30人がコメントを投稿

**合格基準:**
- エラー率: 1%以下
- 平均レスポンス時間: 500ms以内
- サーバーCPU使用率: 80%以下
- メモリ使用率: 80%以下

---

## セキュリティテスト

### SQL Injection

**テストケース:**
- ユーザー入力に `'; DROP TABLE users; --` を入力
- 検索クエリに `' OR '1'='1` を入力

**期待結果:**
- ✅ Prismaのパラメータ化クエリによりエスケープされる
- ✅ SQLとして実行されない
- ✅ エラーハンドリングが正しく動作する

---

### XSS (クロスサイトスクリプティング)

**テストケース:**
- 記事タイトルに `<script>alert('XSS')</script>` を入力
- コメントに `<img src=x onerror="alert('XSS')">` を入力

**期待結果:**
- ✅ Reactの自動エスケープにより無害化される
- ✅ スクリプトが実行されない
- ✅ HTMLタグとして表示される

---

### CSRF (クロスサイトリクエストフォージェリ)

**テストケース:**
- 外部サイトから記事作成リクエストを送信
- 別のドメインからCookieを使ってAPIを叩く

**期待結果:**
- ✅ NextAuth.jsのCSRFトークンチェックで拒否される
- ✅ SameSite Cookie属性により保護される

---

### 認証・認可

**テストケース:**
- 未ログインで `/posts/new` にアクセス
- 他人の記事を編集・削除しようとする
- セッションCookieを改ざんしてAPIリクエスト

**期待結果:**
- ✅ 未ログインユーザーはログインページにリダイレクト
- ✅ 権限不足は 403 Forbidden
- ✅ 改ざんされたセッションは無効として扱われる

---

### パスワードセキュリティ

**テストケース:**
- パスワードがDBに平文で保存されていないか確認
- bcryptのソルトラウンドが10以上か確認

**期待結果:**
- ✅ パスワードはbcryptでハッシュ化される
- ✅ saltRounds: 10
- ✅ レインボーテーブル攻撃に耐性がある

---

## アクセシビリティテスト

### WCAG 2.1 AA準拠確認

| 項目 | 基準 | テスト方法 | data-testid |
|------|------|----------|-------------|
| キーボード操作 | すべての機能がキーボードで操作可能 | 手動テスト | - |
| フォーカス表示 | フォーカス状態が視覚的に明確 | 手動テスト | - |
| 代替テキスト | すべての画像にalt属性 | Lighthouse | `post-cover-{id}` |
| カラーコントラスト | 4.5:1以上 | Lighthouse | - |
| フォームラベル | すべての入力欄にlabel | axe DevTools | `email-input`, `password-input` |
| ARIAラベル | ボタン・リンクに適切なaria-label | axe DevTools | `user-menu-button` |
| エラーメッセージ | role="alert" | 手動テスト | `error-message` |
| ローディング状態 | aria-busy="true" | 手動テスト | `login-button` |

**合格基準:**
- Lighthouse Accessibility Score: 95以上
- axe DevTools: 0 violations

---

## ブラウザ互換性テスト

### 対応ブラウザ

| ブラウザ | バージョン | 優先度 | テスト項目 |
|---------|----------|--------|----------|
| Chrome | 最新版 | P0 | 全機能 |
| Firefox | 最新版 | P1 | 全機能 |
| Safari | 最新版 | P1 | 全機能 |
| Edge | 最新版 | P2 | 主要機能のみ |

### デバイス

| デバイス | 画面サイズ | 優先度 | テスト項目 |
|---------|----------|--------|----------|
| Desktop | 1920x1080 | P0 | 全機能 |
| Tablet | 768x1024 | P1 | レスポンシブ対応 |
| Mobile | 375x667 | P0 | モバイル最適化 |

### テスト項目

- ✅ レイアウトが崩れない
- ✅ すべてのボタンが動作する
- ✅ フォーム送信が正常に動作する
- ✅ 画像が正しく表示される
- ✅ CSSアニメーションが動作する

---

## テスト実行記録

### 実行日時
2025/12/04 12:00

### 実行者
[担当者名]

### テスト結果サマリー

| 項目 | 計画 | 実行 | 合格 | 不合格 | 保留 | 合格率 |
|------|------|------|------|--------|------|--------|
| E2Eテスト | 120 | 0 | 0 | 0 | 120 | - |
| APIテスト | 50 | 0 | 0 | 0 | 50 | - |
| パフォーマンステスト | 10 | 0 | 0 | 0 | 10 | - |
| セキュリティテスト | 15 | 0 | 0 | 0 | 15 | - |
| アクセシビリティテスト | 8 | 0 | 0 | 0 | 8 | - |
| ブラウザ互換性テスト | 20 | 0 | 0 | 0 | 20 | - |
| **合計** | **223** | **0** | **0** | **0** | **223** | **-%** |

### カバレッジ

**未実施 - 実装後に測定**

- **単体テスト**: --%
- **統合テスト**: --%
- **E2Eテスト**: 主要フロー

### 検出されたバグ

**未実施**

---

## 参考資料

- [テスト計画書](./templates/test-plan.md)
- [要件定義書](./blog-requirements.md)
- [システム設計書](./blog-design.md)
- [API設計書](./blog-api-design.md)
- [UI設計書](./blog-ui-design.md)
- [データベース設計書](./blog-database-design.md)

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025/12/04 | 1.0 | 初版作成 | Claude |
