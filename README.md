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

### Day 2 - 2025/10/16

#### 学んだこと

**CSS/スタイリング**
- CSSの基本（クラスセレクタ、プロパティ）
- Flexboxレイアウト（`display: flex`, `gap`, `justify-content`, `align-items`）
- ホバー効果（`:hover`）
- トランジション（`transition`）
- `className`属性の使い方（ReactではHTMLの`class`が`className`）
- レスポンシブデザインの基礎

**実装した内容**
- コンテナのスタイル（カード型デザイン、影、角丸）
- 入力欄とボタンのスタイル（Flexboxで横並び）
- ToDoリストのスタイル（アイテムごとの装飾、左側の緑線）
- ホバーエフェクト（ボタンやアイテムにマウスを乗せた時の変化）
- 色の統一（緑：追加/完了、赤：削除）

### Day 3 - 2025/10/18

#### 学んだこと

**1. オブジェクト配列でのstate管理**
- ToDoを文字列からオブジェクトに変更
- オブジェクト構造：`{ id: number, text: string, completed: boolean }`
- `Date.now()`を使ったユニークID生成

**2. チェックボックスのイベント処理**
- `checked`プロパティでReactが制御
- `onChange`でチェック状態の切り替え
- `map`を使った配列の一部要素の更新

**3. 条件付きスタイル**
- テンプレートリテラルと三項演算子の組み合わせ
- `className={`todo-text ${completed ? 'completed' : ''}`}`
- 完了時の取り消し線（`text-decoration: line-through`）

**4. Reactのイミュータビリティ（不変性）**
- stateを直接変更してはいけない理由
- スプレッド構文`{ ...todo, completed: !todo.completed }`
- `map`で新しい配列を作成

**実装した内容**
- 完了/未完了チェックボックス機能
- 完了時の取り消し線スタイル
- ToDoオブジェクトへのデータ構造の変更
- `toggleTodo`関数の実装

## 🚀 実装した機能

- ✅ ToDoの追加
- ✅ ToDoの削除
- ✅ 完了/未完了チェックボックス
- ✅ 完了時の取り消し線スタイル
- ✅ 入力バリデーション（空のToDoは追加不可）
- ✅ Unit Test（5個のテストケース）
- ✅ Storybook（4つのストーリー）
- ✅ CSS/スタイリング（Flexbox、ホバーエフェクト）

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

- [x] CSS/スタイリングの追加
- [x] 完了/未完了のチェックボックス
- [ ] ToDoの編集機能
- [ ] LocalStorageでのデータ永続化
- [ ] フィルター機能（全て/未完了/完了）
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
