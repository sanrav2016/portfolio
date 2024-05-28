import React, { useState } from 'react'
import Scene from './Scene.jsx'
import Home from './Home.jsx'
import Blog from './Blog.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './Footer'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path=":slug" element={<Blog darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App