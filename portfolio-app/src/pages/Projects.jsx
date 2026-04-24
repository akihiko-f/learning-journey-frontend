import { Link } from 'react-router-dom'

function Projects() {
    const projects = [
        { id: 1, name: 'ToDoアプリ', description: 'タスク管理アプリケーション' },
        { id: 2, name: 'タイマーアプリ', description: 'カウントダウンタイマー' },
        { id: 3, name: '計算機アプリ', description: '四則演算ができる電卓' },
        { id: 4, name: 'お気に入りリスト', description: 'アイテムを保存・管理' },
        { id: 5, name: 'メモアプリ', description: 'メモの作成・編集・削除' },
        { id: 6, name: '家計簿アプリ', description: '収支管理とグラフ表示' },
    ]

    return (
        <div className="page">
            <h1>Projects</h1>
            <p>これまでに作成したプロジェクト一覧です。</p>

            <div className="projects-grid">
                {projects.map(project => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="project-card-link"
                    >
                        <div key={project.id} className="project-card">
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <span className="view-detail">詳細を見る →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Projects