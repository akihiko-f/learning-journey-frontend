import { Link } from "react-router-dom"
import logo from "../../assets/logo.png"

function Header() {
    return (
        <header>
            <div>
                <img src={logo} alt="ロゴ" />
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About us</Link></li>
                    <li><Link to="/service">Service</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
        </header>
    )
}

export default Header