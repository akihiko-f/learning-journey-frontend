import { useState } from 'react'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import FeatureSection from './components/sections/FeatureSection'

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeatureSection />
      {/* <pricingSection>
      <CTASection>
      </CTASection>
      */}
      <Footer />
    </>
  )
}

export default App
