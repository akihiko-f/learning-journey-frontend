# 開発ドキュメント

このディレクトリには、Phase 5（実践的な開発プロセス）で使用する開発ドキュメントが含まれています。

## ディレクトリ構造

```
docs/
├── README.md              # このファイル（ガイド）
├── templates/             # ドキュメントテンプレート
│   ├── requirements.md    # 要件定義テンプレート
│   ├── design.md          # システム設計テンプレート
│   ├── api-design.md      # API設計テンプレート
│   ├── database-design.md # データベース設計テンプレート
│   ├── ui-design.md       # UI設計+テストロケーター
│   ├── test-plan.md       # テスト計画+TDD/ATDD戦略
│   └── test-design.md     # テスト設計
└── (実際のプロジェクトドキュメントをここに作成)
```

## テンプレートの使い方

1. `templates/`ディレクトリから必要なテンプレートをコピー
2. `docs/`直下に実際のプロジェクト名でファイルを作成
3. テンプレートに沿って内容を記入

**例:**
```bash
# ブログアプリの要件定義を作成する場合
cp docs/templates/requirements.md docs/blog-requirements.md
# その後、blog-requirements.mdを編集
```

---

## ドキュメント一覧と使用順序

### 1. 要件定義フェーズ

#### [`templates/requirements.md`](./templates/requirements.md)
プロジェクトの要件を定義します。

**含まれる内容:**
- プロジェクト概要
- ユーザーストーリー（INVEST原則に基づく）
- 機能要件・非機能要件
- 技術スタック
- 画面一覧
- 制約事項・リスク

**成果物:**
- 要件定義書
- ユーザーストーリー一覧

**次のステップ:** テスト観点でレビュー（[`templates/test-plan.md`](./templates/test-plan.md) Phase 1参照）

---

### 2. 設計フェーズ

#### [`templates/design.md`](./templates/design.md)
システム全体のアーキテクチャと設計を記述します。

**含まれる内容:**
- アーキテクチャ概要
- ディレクトリ構成
- コンポーネント設計
- データフロー
- ルーティング設計
- セキュリティ設計
- エラーハンドリング
- パフォーマンス最適化
- テスト戦略
- デプロイメント戦略

**成果物:**
- システム設計書
- アーキテクチャ図

**次のステップ:** テスト観点でレビュー（[`templates/test-plan.md`](./templates/test-plan.md) Phase 2参照）

---

### 3. 詳細設計フェーズ

以下の3つのドキュメントを並行して作成します。

#### [`templates/ui-design.md`](./templates/ui-design.md)
画面設計とテストロケーターを統合管理します。

**含まれる内容:**
- デザインシステム（色、タイポグラフィ、スペーシング）
- ロケーター命名規則
- 画面ごとのワイヤーフレーム
- HTML構造とdata-testid
- ロケーター一覧表
- ARIA属性（アクセシビリティ）
- レスポンシブデザイン

**成果物:**
- UI設計書
- テストロケーター一覧

**ポイント:** 画面設計と同時にE2Eテスト用のロケーター（`data-testid`）を決定することで、後工程がスムーズになります。

---

#### [`templates/api-design.md`](./templates/api-design.md)
APIの仕様を定義します。

**含まれる内容:**
- ベースURL
- 共通ヘッダー
- エンドポイント定義
- リクエスト/レスポンス例
- エラーコード
- レート制限
- バージョニング戦略

**成果物:**
- API仕様書
- エンドポイント一覧

---

#### [`templates/database-design.md`](./templates/database-design.md)
データベースのスキーマを設計します。

**含まれる内容:**
- ER図
- テーブル定義
- Prismaスキーマ例
- マイグレーション戦略
- パフォーマンス最適化（インデックス設計）
- バックアップ戦略

**成果物:**
- データベース設計書
- Prismaスキーマファイル

**次のステップ:** テスト観点でレビュー（[`templates/test-plan.md`](./templates/test-plan.md) Phase 3参照）

---

### 4. テストフェーズ

#### [`templates/test-plan.md`](./templates/test-plan.md)
**【重要】開発プロセス全体のガイド**

このドキュメントは、要件定義からリリースまでの全フローを定義しています。

**含まれる内容:**
- V-model + TDD/ATDD統合フロー
- シフトレフトアプローチ（各フェーズでのテスト観点レビュー）
- フェーズ1～10の詳細手順
- テストレベル（単体・統合・E2E・パフォーマンス・セキュリティ・アクセシビリティ）
- TDD/ATDDの実践サイクル
- 品質ゲート
- Exit Criteria（リリース判定基準）
- RACI Matrix
- カバレッジ・品質メトリクス
- バグ管理
- 用語集

**ポイント:** このドキュメントを読めば、開発プロセス全体の流れが理解できます。

---

#### [`templates/test-design.md`](./templates/test-design.md)
具体的なテストケースとテストデータを設計します。

**含まれる内容:**
- テスト技法（同値分割、境界値分析、デシジョンテーブル、状態遷移）
- 機能別テストケース
- テストデータ
- 期待結果
- 優先度（P0/P1/P2/P3）

**成果物:**
- テスト設計書
- テストケース一覧
- テストデータ

**次のステップ:** テスト実装（[`templates/test-plan.md`](./templates/test-plan.md) Phase 5参照）

---

## 開発フロー概要

```
【要件定義】templates/requirements.md
   ↓
[テスト観点レビュー] templates/test-plan.md Phase 1
   ↓
【システム設計】templates/design.md
   ↓
[テスト観点レビュー] templates/test-plan.md Phase 2
   ↓
【詳細設計】templates/ui-design.md / api-design.md / database-design.md
   ↓
[テスト観点レビュー] templates/test-plan.md Phase 3
   ↓
【テスト設計】templates/test-design.md
   ↓
[レビュー] templates/test-plan.md Phase 4
   ↓
【テスト実装】(ATDD: E2Eテスト、TDD: 単体テスト)
   ↓
【開発実装】(TDD/ATDDサイクル)
   ↓
【追加テスト実行】(パフォーマンス、セキュリティ等)
   ↓
【テスト結果分析】(カバレッジ、品質メトリクス)
   ↓
【リリース判定】(Exit Criteria確認)
   ↓
【リリース】
```

詳細は [`templates/test-plan.md`](./templates/test-plan.md) を参照してください。

---

## ドキュメント管理のポイント

### 1. 同時に参照・更新するものは統合

- **UI設計 + テストロケーター** → `ui-design.md`
  - 画面を設計する際に、同時にE2Eテスト用のロケーター（`data-testid`）を決定
  - 実装時とテスト実装時の両方で参照

- **テスト戦略 + テスト計画** → `test-plan.md`
  - 開発プロセス全体とテスト戦略を一つのドキュメントで管理
  - フェーズごとの進め方が明確

### 2. トレーサビリティ

要件からテストケースまでの追跡可能性を確保します。

```
requirements.md (ユーザーストーリー)
    ↓
test-design.md (テストケース)
    ↓
test-plan.md (テスト実行・結果)
```

### 3. 一人開発でも品質を保つ

- **RACI Matrix**: 各フェーズでの責任を明確化（一人でも役割を分けて考える）
- **Quality Gate**: 各フェーズで満たすべき品質基準
- **Exit Criteria**: リリース判定の客観的な基準

---

## はじめに読むべきドキュメント

1. **このREADME** - 全体像を把握
2. **[`templates/test-plan.md`](./templates/test-plan.md)** - 開発プロセス全体の流れを理解
3. **[`templates/requirements.md`](./templates/requirements.md)** - 要件定義テンプレートを確認してから実際のプロジェクトドキュメントを作成

---

## 参考資料

- **TDD (Test-Driven Development)**: テスト駆動開発
- **ATDD (Acceptance Test-Driven Development)**: 受け入れテスト駆動開発
- **シフトレフト**: テストを開発の早期段階で実施するアプローチ
- **V-Model**: 開発とテストの対応関係を示すモデル
- **INVEST原則**: 良いユーザーストーリーの条件（Independent, Negotiable, Valuable, Estimable, Small, Testable）
- **WCAG 2.1 AA**: Webアクセシビリティガイドライン

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-12-02 | 初版作成 |
