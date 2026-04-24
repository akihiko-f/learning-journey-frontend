import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div>
                    <h3>会社情報</h3>
                    <ul>
                        <li><Link to="/about">会社概要</Link></li>
                        <li>採用情報</li>
                        <li><Link to="/contact">お問い合わせ</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>サービス</h3>
                    <ul>
                        <li>機能一覧</li>
                        <li><Link to="/pricing">料金プラン</Link></li>
                        <li>導入事例</li>
                    </ul>
                </div>

                <div>
                    <h3>サポート</h3>
                    <ul>
                        <li>ヘルプ</li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/terms">利用規約</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-copyright">
                <p>2025 Sample App</p>
            </div>
        </footer>
    )
}

export default Footer