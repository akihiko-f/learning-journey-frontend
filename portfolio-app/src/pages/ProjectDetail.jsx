import { useParams, Link } from 'react-router-dom'

function ProjectDetail() {
    const { id }= useParams()

    const projects = {
        1: {
            name: 'ToDoアプリ',
            description: 'タスク管理アプリケーション',
            features: [
                'ToDoの追加・編集・削除',
                '完了/未完了の切り替え',
                'フィルター機能（全て/未完了/完了）',
                'LocalStorageでデータ永続化',
            ],
            technologies: ['React', 'JavaScript', 'CSS', 'LocalStorage'],
            date: '2025年10月',
        },
        2: {
            name: 'タイマーアプリ',
            description: 'カウントダウンタイマー',
            features: [
                '時間設定（分・秒）',
                'スタート/ストップ/リセット機能',
                '時間切れ通知',
                'タイマー実行中の入力欄無効化',
            ],
            technologies: ['React', 'JavaScript', 'CSS', 'setInterval'],
            date: '2025年10月',
        },
        3: {
            name: '計算機アプリ',
            description: '四則演算ができる電卓',
            features: [
                '四則演算（+、-、*、/）',
                '連続計算対応',
                '計算履歴の表示',
                'ゼロ除算対策',
            ],
            technologies: ['React', 'JavaScript', 'CSS Grid'],
            date: '2025年11月',
        },
        4: {
            name: 'お気に入りリスト',
            description: 'アイテムを保存・管理',
            features: [
                'アイテムの追加・削除',
                'お気に入りマーク（星アイコン）',
                'LocalStorageで保存',
                'レスポンシブデザイン',
            ],
            technologies: ['React', 'JavaScript', 'CSS Flexbox', 'LocalStorage'],
            date: '2025年11月',
        },
        5: {
            name: 'メモアプリ',
            description: 'メモの作成・編集・削除',
            features: [
                'メモの作成・編集・削除',
                'タイトルと本文',
                '作成日時の表示',
                '検索機能',
            ],
            technologies: ['React', 'JavaScript', 'CSS', 'LocalStorage'],
            date: '2025年11月',
        },
        6: {
            name: '家計簿アプリ',
            description: '収支管理とグラフ表示',
            features: [
                '収入・支出の記録',
                'カテゴリ分類',
                '合計金額の計算',
                '月ごとの表示切り替え',
                'グラフ表示（カテゴリ別支出・収入支出比較）',
            ],
            technologies: ['React', 'JavaScript', 'CSS', 'LocalStorage'],
            date: '2025年11月',
        },
    }

    const project = projects[id]

    if (!project) {
        return (
            <div className='page'>
                <h1>プロジェクトが見つかりません</h1>
                <p>指定されたIDのプロジェクトは存在しません。</p>
                <Link to="/projects" className='back-link'>
                    ← プロジェクト一覧に戻る
                </Link>
            </div>
        )
    }

    return (
        <div className='page'>
            <Link to="/projects" className='back-link'>
                ← プロジェクト一覧に戻る
            </Link>

            <h1>{project.name}</h1>
            <p className='project-description'>{project.description}</p>
            <p className='project-date'>作成日：{project.date}</p>

            <h2>主な機能</h2>
            <ul>
                {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>

            <h2>使用技術</h2>
            <div className='tech-tags'>
                {project.technologies.map((tech, index) => (
                    <span key={index} className='tech-tag'>
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default ProjectDetail