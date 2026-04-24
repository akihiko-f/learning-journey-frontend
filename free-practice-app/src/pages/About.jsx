function About() {
    return (
        <div className="page-container">
            <h1>会社概要</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>株式会社サンプル</h2>
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    ※ これはReact学習用のサンプルアプリケーションです
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>会社情報</h3>
                <table style={{ width: '100%', maxWidth: '600px', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold', width: '150px' }}>会社名</td>
                            <td style={{ padding: '0.75rem' }}>株式会社サンプル</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>設立</td>
                            <td style={{ padding: '0.75rem' }}>2025年1月</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>所在地</td>
                            <td style={{ padding: '0.75rem' }}>東京都サンプル区サンプル町1-2-3</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>代表者</td>
                            <td style={{ padding: '0.75rem' }}>代表取締役 サンプル太郎</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>事業内容</td>
                            <td style={{ padding: '0.75rem' }}>Webアプリケーション開発（学習用）</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>ミッション</h3>
                <p>React学習を通じて、モダンなWebアプリケーション開発スキルを習得する</p>
            </section>

            <section>
                <h3>技術スタック</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>React 18</li>
                    <li>React Router</li>
                    <li>CSS Modules</li>
                    <li>Vite</li>
                </ul>
            </section>
        </div>
    )
}

export default About