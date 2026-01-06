import React, { useState, useEffect } from 'react'
import Scene from './Scene.jsx'
import Home from './Home.jsx'
import Blog from './Blog.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './Footer'
import { Analytics } from "@vercel/analytics/react"
import LofiProvider from './LofiProvider.jsx'

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const val = localStorage.getItem('darkMode')
      if (val !== null) return val === 'true'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode)
    } catch (e) {
      console.error('Failed to save dark mode preference', e)
    }
  }, [darkMode])

  return (
    <LofiProvider>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/">
            <Route index element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path=":slug" element={<Blog darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
      <Analytics />
    </LofiProvider>
  )
}

export default App