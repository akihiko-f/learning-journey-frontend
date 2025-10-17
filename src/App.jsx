import { useState } from "react";
import './App.css';

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("")

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
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    setTodos(newTodos)
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
        {todos.map((todo) => {
          return (
          <li key={todo.id} className="todo-item">
            {/* チェックボックスを追加 */}
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {/* 完了している場合は取り消し線 */}
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </span>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
              削除
            </button>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App;