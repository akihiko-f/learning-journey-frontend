import { useState, useEffect } from "react"
import './App.css'
import TodoForm from './components/TodoForm'
import FilterTabs from './components/FilterTabs'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      return JSON.parse(savedTodos)
    }
    return []
  })
  const [inputValue, setInputValue] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const [filter, setFilter] = useState("all")

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
        return { ...todo, completed: !todo.completed}
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
          return { ...todo, text: editingText }
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

  const getFilteredTodos = () => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed)
    }
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed)
    }
    return todos
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const filteredTodos = getFilteredTodos()

  // タイマーアプリのState管理
  const [time, settingTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="todo-container">
      <h1>ToDoリスト</h1>

      <TodoForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        addTodo={addTodo}
      />

      <FilterTabs
        filter={filter}
        setFilter={setFilter}
      />

      <TodoList
        filteredTodos={filteredTodos}
        editingId={editingId}
        editingText={editingText}
        setEditingText={setEditingText}
        toggleTodo={toggleTodo}
        startEdit={startEdit}
        saveEdit={saveEdit}
        cancelEdit={cancelEdit}
        deleteTodo={deleteTodo}
      />
    </div>
  )
}

export default App