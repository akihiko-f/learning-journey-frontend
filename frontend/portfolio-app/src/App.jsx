import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='app'>
          <Navbar />
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/projects' element={<Projects />} />
              <Route path='/projects/:id' element={<ProjectDetail />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App