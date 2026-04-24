import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Service from './pages/Service.jsx'
import Contact from './pages/Contact.jsx'
import Pricing from './pages/Pricing.jsx'
import FAQ from './pages/FAQ.jsx'
import Terms from './pages/Terms.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/learning-journey">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='service' element={<Service />} />
          <Route path='contact' element={<Contact />} />
          <Route path='pricing' element={<Pricing />} />
          <Route path='faq' element={<FAQ />} />
          <Route path='terms' element={<Terms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
