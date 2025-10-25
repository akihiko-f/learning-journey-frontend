import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('ToDoアプリ', () => {
  it('タイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('ToDoリスト')).toBeInTheDocument()
  })

  it('ToDoを追加できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    // 入力欄を見つける
    const input = screen.getByPlaceholderText('やることを入力')
    // 追加ボタンを見つける
    const addButton = screen.getByText('追加')

    // 「買い物」と入力
    await user.type(input, '買い物')
    // 追加ボタンをクリック
    await user.click(addButton)

    // 「買い物」が表示されているか確認
    expect(screen.getByText('買い物')).toBeInTheDocument()
  })

  it('空のToDoは追加できない', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addButton = screen.getByText('追加')

    // 何も入力せずに追加ボタンをクリック
    await user.click(addButton)

    // リストが空であることを確認（li要素がない）
    const listItems = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(0)
  })

  it('ToDoを削除できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('やることを入力')
    const addButton = screen.getByText('追加')

    // ToDoを追加
    await user.type(input, '掃除')
    await user.click(addButton)

    // 削除ボタンを見つけてクリック
    const deleteButton = screen.getByText('削除')
    await user.click(deleteButton)

    // 「掃除」が消えていることを確認
    expect(screen.queryByText('掃除')).not.toBeInTheDocument()
  })

  it('複数のToDoを追加できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('やることを入力')
    const addButton = screen.getByText('追加')

    // 1つ目のToDoを追加
    await user.type(input, '買い物')
    await user.click(addButton)

    // 2つ目のToDoを追加
    await user.type(input, '掃除')
    await user.click(addButton)

    // 3つ目のToDoを追加
    await user.type(input, '洗濯')
    await user.click(addButton)

    // 3つとも表示されているか確認
    expect(screen.getByText('買い物')).toBeInTheDocument()
    expect(screen.getByText('掃除')).toBeInTheDocument()
    expect(screen.getByText('洗濯')).toBeInTheDocument()
  })
})
