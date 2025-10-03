import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import assets from './assets/assets'
import './App.css'
import Navbar from './components/Navbar'
import Form from './components/Form'
import Footer from './components/Footer'
import Homepage from './components/Homepage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div
        className="App relative w-screen z-10 bg-cover bg-white bg-no-repeat bg-center min-h-screen flex flex-col justify-between"
        style={{ backgroundImage: `url(${assets.wildcats_marketplace_bg_image})` }}
      >
        <nav className="w-full sticky h-16 top-0 z-50">
          <Navbar />
        </nav>

        <div className="flex items-center justify-center max-w-320">
         <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/login" element={<Form />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  )
}

export default App
