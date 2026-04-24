import { useEffect, useState } from "react"
import './App.css'

function App() {

  const [inputText, setInputText] = useState('')
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('favoriteItems')
    return savedItems ? JSON.parse(savedItems) : []
  })

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(items))
  }, [items])

  const handleAddItem = () => {
    if (inputText.trim() === ''){
      return
    }

    const newItem = {
      id: Date.now(),
      text: inputText,
      isFavorite: false
    }

    setItems([...items, newItem])
    setInputText('')
  }

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleToggleFavorite = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite }
      }

      return item
    }))
  }

  return (
    <div className="app">
      <h1>お気に入りリスト</h1>
      <div className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="アイテムを入力..."
        />
        <button onClick={handleAddItem}>追加</button>
      </div>

      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => handleToggleFavorite(item.id)}>
              {item.isFavorite ? '★' : '☆'}
            </button>
            <span>{item.text}</span>
            <button onClick={() => handleDeleteItem(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App