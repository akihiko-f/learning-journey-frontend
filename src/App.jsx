import { useState } from "react";
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("")

  const addTodo = () => {
    if (inputValue.trim() !=="") {
      setTodos([...todos, inputValue])
      setInputValue("")
    }
  }

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index)
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
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
           <span className="todo-text">{todo}</span>
            <button className="delete-button" onClick={() => deleteTodo(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App