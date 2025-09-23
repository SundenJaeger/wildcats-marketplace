import { useState } from 'react'
import assets from './assets/assets'
import './App.css'
import Navbar from './components/Navbar'
import Form from './components/form'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      className="App relative w-full z-10 bg-white"
      style={{
        backgroundImage: `url(${assets.wildcats_marketplace_bg_image})`
      }}
    >
      <Navbar/>

      <div className='flex items-center justify-center'>
        <Form/> 
      </div>

      <Footer/>
    </div>
  )
}

export default App
