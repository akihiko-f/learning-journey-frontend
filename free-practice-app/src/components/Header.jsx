import logo from "../assets/logo.png"

function Header() {
    return (
        <header>
            <div>
                <img src={logo} alt="ロゴ" />
                <ul>
                    <li>ホーム</li>
                    <li>会社概要</li>
                    <li>プロダクト</li>
                    <li>問い合わせ先</li>
                </ul>
            </div>
        </header>
    )
}

export default Header