import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

function Navbar() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <nav className='navbar'>
            <div className='nav-container'>
                <Link to="/" className='nav-logo'>
                    MyPortfolio
                </Link>

                <ul className='nav-menu'>
                    <li className='nav-item'>
                        <Link to="/" className='nav-link'>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/about" className='nav-link'>
                            About
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/projects" className='nav-link'>
                            Projects
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/contact" className='nav-link'>
                            Contact
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <button onClick={toggleTheme} className='theme-toggle'>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar