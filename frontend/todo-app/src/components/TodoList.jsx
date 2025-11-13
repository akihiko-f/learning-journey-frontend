import TodoItem from './TodoItem'

function TodoList({
    filteredTodos,
    editingId,
    editingText,
    setEditingText,
    toggleTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteTodo
}) {
    return (
        <ul className="todo-list">
            {filteredTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    editingId={editingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    toggleTodo={toggleTodo}
                    startEdit={startEdit}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    deleteTodo={deleteTodo}
                />
            ))}
        </ul>
    )
}

export default TodoList