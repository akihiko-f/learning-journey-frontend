function TodoForm({ inputValue, setInputValue, addTodo }) {
    return (
        <>
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
        </>
    )
}

export default TodoForm