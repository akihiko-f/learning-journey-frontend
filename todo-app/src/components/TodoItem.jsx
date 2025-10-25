function TodoItem({
    todo,
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
        <li className="todo-item">
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
                    <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
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
    )
}

export default TodoItem