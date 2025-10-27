import logo from "../../assets/logo.png"

function Header() {
    return (
        <header>
            <div>
                <img src={logo} alt="ロゴ" />
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Service</li>
                    <li>Contact</li>
                </ul>
            </div>
        </header>
    )
}

export default Header