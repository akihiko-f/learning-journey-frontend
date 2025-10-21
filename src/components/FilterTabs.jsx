function FilterTabs({ filter, setFilter }) {
    return (
        <div className="filter-tabs">
            <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
            >
                全て
            </button>
            <button
                className={`filter-tab ${filter === "active" ? "active" : ""}`}
                onClick={() => setFilter("active")}
            >
                未完了
            </button>
            <button
                className={`filter-tab ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
            >
                完了
            </button>
        </div>
    )
}

export default FilterTabs