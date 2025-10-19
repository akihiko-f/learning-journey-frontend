import { useState } from "react";
import './App.css';

function App() {
  const [todos,setTodos] =useState([])
  const [inputValue, setInputValue] =useState("")

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      }
      setTodos([...todos, newTodo])
      setInputValue("")
    }
  }

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, completed: !todo.completed}
      }
      return todo
    })
    setTodos(newTodos)
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() !== "") {
      const newTodos = todos.map((todo) => {
        if (todo.id === editingId) {
          return {...todo, text: editingText}
        }
        return todo
      })
      setTodos(newTodos)
    }
    setEditingId(null)
    setEditingText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  return (
    <div className="todo-container">
      <h1>ToDoリスト</h1>
      <div className="input-area">
        <input
          type="text"
          className="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="やることを入力"
        />
      </div>
      <button className="add-button" onClick={addTodo}>追加</button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            {editingId === todo.id ? (
              <>
                <input
                type="text"
                className="todo-input"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                autoFocus
                />
                <button className="save-button" onClick={saveEdit}>
                  保存
                </button>
                <button className="cancel-button" onClick={cancelEdit}>
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <button
                  className="edit-button"
                  onClick={() => startEdit(todo.id, todo.text)}
                >
                  編集
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  削除
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;