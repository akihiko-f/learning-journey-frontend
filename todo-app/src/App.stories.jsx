import App from './App.jsx'

/**
 * # ToDoリストアプリ
 *
 * シンプルなToDoリスト管理アプリケーションです。
 *
 * ## 機能
 * - ToDoの追加
 * - ToDoの削除
 * - 入力バリデーション（空のToDoは追加不可）
 *
 * ## 使い方
 * 1. 入力欄に実行したいタスクを入力
 * 2. 「追加」ボタンをクリック
 * 3. 追加されたタスクが下部のリストに表示されます
 * 4. 完了したタスクは「削除」ボタンで削除できます
 */
export default {
  title: 'App/TodoList',
  component: App,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'ToDoリストの管理機能を提供するメインアプリケーションです。',
      },
    },
  },
  tags: ['autodocs'],
}

/**
 * ## 初期状態
 *
 * アプリを開いた直後の状態です。ToDoリストは空で、入力欄のみが表示されています。
 *
 * ### 操作手順
 * 1. 入力欄をクリック
 * 2. テキストを入力
 * 3. 「追加」ボタンをクリック
 */
export const Empty = {
  render: () => <App />,
  parameters: {
    docs: {
      description: {
        story: '何もToDoがない初期状態です。ここから新しいToDoを追加できます。',
      },
    },
  },
}

/**
 * ## ToDoが1つある状態
 *
 * 1つのToDoが追加された状態です。各ToDoの横には削除ボタンが表示されます。
 *
 * ### 確認ポイント
 * - ToDoがリストに表示される
 * - 削除ボタンが表示される
 * - 入力欄は空の状態に戻る
 */
export const WithOneItem = {
  render: () => {
    // この例では手動で操作が必要
    return <App />
  },
  parameters: {
    docs: {
      description: {
        story: 'ToDoを1つ追加した状態です。ユーザーは削除ボタンでToDoを削除できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { userEvent, within } = await import('@storybook/test')
    const canvas = within(canvasElement)

    const input = canvas.getByPlaceholderText('やることを入力')
    const button = canvas.getByText('追加')

    await userEvent.type(input, '買い物に行く')
    await userEvent.click(button)
  },
}

/**
 * ## ToDoが複数ある状態
 *
 * 複数のToDoが登録されている状態です。実際の使用シーンに近い状態です。
 *
 * ### 確認ポイント
 * - 複数のToDoが順番に表示される
 * - スクロールが必要な場合の表示
 * - 各ToDoに削除ボタンがある
 */
export const WithMultipleItems = {
  render: () => <App />,
  parameters: {
    docs: {
      description: {
        story: '複数のToDoが登録された状態です。日常的な使用状況を想定しています。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { userEvent, within } = await import('@storybook/test')
    const canvas = within(canvasElement)

    const input = canvas.getByPlaceholderText('やることを入力')
    const button = canvas.getByText('追加')

    const items = ['買い物に行く', '掃除をする', '洗濯をする', 'メールを返信する']

    for (const item of items) {
      await userEvent.type(input, item)
      await userEvent.click(button)
    }
  },
}

/**
 * ## 長いテキストのToDo
 *
 * 長いテキストが入力された場合の表示を確認します。
 *
 * ### 確認ポイント
 * - レイアウトが崩れない
 * - テキストが適切に折り返される
 * - 削除ボタンが正しい位置に表示される
 */
export const WithLongText = {
  render: () => <App />,
  parameters: {
    docs: {
      description: {
        story: '長いテキストが入力された場合でも、レイアウトが崩れないことを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { userEvent, within } = await import('@storybook/test')
    const canvas = within(canvasElement)

    const input = canvas.getByPlaceholderText('やることを入力')
    const button = canvas.getByText('追加')

    await userEvent.type(
      input,
      'これは非常に長いToDoアイテムのテキストです。レイアウトが崩れないかを確認するためのサンプルテキストで、実際にはこのような長いタスク名は推奨されませんが、エッジケースとして確認が必要です。'
    )
    await userEvent.click(button)
  },
}
