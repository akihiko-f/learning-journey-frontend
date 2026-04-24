import { useState, useEffect } from "react"
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [memos, setMemos] = useState(() => {
    const savedMemos = localStorage.getItem('memos')
    return savedMemos ? JSON.parse(savedMemos) : []
  })

  const [editingId, setEditingId] = useState(null)

  const handleSaveMemo = () => {
    if (title.trim() === '' || content.trim() === '') {
      alert('タイトルと本文を入力してください')
      return
    }

    if (editingId) {
      setMemos(memos.map(memo =>
        memo.id === editingId
        ? {...memo, title, content}
        : memo
      ))
      setEditingId(null)
    } else {
      const newMemo = {
        id: Date.now(),
        title: title,
        content: content,
        createdAt: new Date().toISOString()
      }
    
      setMemos([newMemo, ...memos])
    }
    setTitle('')
    setContent('')
  }

  const handleDeleteMemo = (id) => {
    setMemos(memos.filter(memo => memo.id !== id))
  }

  const handleEditMemo = (memo) => {
    setTitle(memo.title)
    setContent(memo.content)
    setEditingId(memo.id)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  const filteredMemos = memos.filter(memo => {
    const searchLower = searchTerm.toLowerCase()
    return memo.title.toLowerCase().includes(searchLower) ||
           memo.content.toLowerCase().includes(searchLower)
  })

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos))
  }, [memos])

  return (
    <div className="app">
      <h1>メモアプリ</h1>

      <div className="memo-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力..."
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="本文を入力..."
          rows="5"
        />
        <button onClick={handleSaveMemo}>
          {editingId ? 'メモを更新' : 'メモを保存'}
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="検索..."
        />
      </div>

      <div className="memo-list">
        <h2>メモ一覧</h2>
        {filteredMemos.length === 0 ? (
          <p>{searchTerm ? '検索結果がありません' : 'メモがありません'}</p>
        ) : (
          filteredMemos.map((memo) => (
            <div key={memo.id} className="memo-item">
              <h3>{memo.title}</h3>
              <p className="memo-date">{formatDate(memo.createdAt)}</p>
              <p>{memo.content}</p>
              <button onClick={() => handleEditMemo(memo)}>編集</button>
              <button onClick={() => handleDeleteMemo(memo.id)}>削除</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App