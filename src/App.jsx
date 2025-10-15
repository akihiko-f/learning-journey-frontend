import { useState } from "react";

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
    <div>
      <h1>ToDoリスト</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="やることを入力"
      />
      <button onClick={addTodo}>追加</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => deleteTodo(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App