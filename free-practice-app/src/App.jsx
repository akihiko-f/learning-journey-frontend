import { useState } from 'react'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      {/*  <FeatureSection>
      </FeatureSection>
      <pricingSection>
      </pricingSection>
      <CTASection>
      </CTASection>
      */}
      <Footer />
    </>
  )
}

export default App
