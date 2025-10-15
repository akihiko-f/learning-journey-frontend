# React学習プロジェクト - ToDoアプリ

プログラミング入門レベルからReactでwebアプリを作れるようになるための学習プロジェクトです。

## 📚 学習記録

### Day 1 - 2025/10/16

#### 学んだこと

**1. React基礎**
- JSXの書き方（HTMLのような構文）
- `useState`での状態管理
- イベントハンドラ（`onClick`, `onChange`）
- 配列操作（`map`, `filter`, スプレッド構文`...`）
- コンポーネントの構造（`function`と`const`の使い分け）

**2. テスト**
- Unit Test（Vitest + React Testing Library）
  - コンポーネントのロジックをテスト
  - ユーザー操作をシミュレート
- Storybook
  - コンポーネントのカタログ作成
  - 様々な状態を可視化
  - ドキュメント自動生成

**3. テストの種類と使い分け**
- Unit/Integration Test：ロジックのテスト（高速・大量）
- Visual Regression Test：見た目のテスト（Chromatic）
- E2E Test：実際のユーザーフロー（重要な部分のみ）

**4. Git/GitHub**
- リポジトリの初期化
- コミットの作成
- GitHubへのpush

## 🚀 実装した機能

- ✅ ToDoの追加
- ✅ ToDoの削除
- ✅ 入力バリデーション（空のToDoは追加不可）
- ✅ Unit Test（5個のテストケース）
- ✅ Storybook（4つのストーリー）

## 🛠️ 技術スタック

- **フレームワーク**: React 19
- **ビルドツール**: Vite
- **テストフレームワーク**: Vitest
- **テストライブラリ**: React Testing Library
- **コンポーネントカタログ**: Storybook
- **言語**: JavaScript

## 📦 セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# テストの実行
npm run test

# Storybookの起動
npm run storybook
```

## 🧪 テスト

### Unit Test実行

```bash
npm run test
```

**テストケース:**
- タイトルが表示される
- ToDoを追加できる
- 空のToDoは追加できない
- ToDoを削除できる
- 複数のToDoを追加できる

### Storybook

```bash
npm run storybook
```

ブラウザで `http://localhost:6006` を開くと、以下のストーリーが確認できます：

- **Empty**: 初期状態（空のリスト）
- **WithOneItem**: ToDoが1つある状態
- **WithMultipleItems**: 複数のToDoがある状態
- **WithLongText**: 長いテキストのToDo

## 📖 学習メモ

### React基礎

#### useState
```jsx
const [count, setCount] = useState(0)
```
- `count`: 現在の値
- `setCount`: 値を更新する関数
- `useState(0)`: 初期値は0

#### 配列の更新
```jsx
// スプレッド構文で新しい配列を作成
setTodos([...todos, newTodo])

// filterで特定の要素を除外
setTodos(todos.filter((_, i) => i !== index))
```

#### イベントハンドラ
```jsx
// onChangeでリアルタイムに値を取得
<input onChange={(e) => setValue(e.target.value)} />

// onClickでボタンクリックを処理
<button onClick={() => addTodo()}>追加</button>
```

### テストの書き方

```jsx
it('ToDoを追加できる', async () => {
  render(<App />)
  const input = screen.getByPlaceholderText('やることを入力')
  const button = screen.getByText('追加')

  await user.type(input, '買い物')
  await user.click(button)

  expect(screen.getByText('買い物')).toBeInTheDocument()
})
```

## 🎯 次の学習目標

- [ ] CSS/スタイリングの追加
- [ ] ToDoの編集機能
- [ ] 完了/未完了のチェックボックス
- [ ] LocalStorageでのデータ永続化
- [ ] コンポーネント分割（再利用可能な設計）
- [ ] E2Eテストの追加（Playwright）
- [ ] Visual Regression Test（Chromatic）

## 📝 学習リソース

- [React公式ドキュメント](https://react.dev/)
- [Vite公式ドキュメント](https://vite.dev/)
- [React Testing Libraryドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybookドキュメント](https://storybook.js.org/docs/)

---

🤖 このプロジェクトは[Claude Code](https://claude.com/claude-code)と一緒に学習しながら作成しました。
