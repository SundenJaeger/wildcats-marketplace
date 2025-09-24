import { useState } from 'react'
import assets from './assets/assets'
import './App.css'
import Navbar from './components/Navbar'
import Form from './components/Form'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      className="App relative w-screen z-10 bg-cover bg-white bg-no-repeat bg-center min-h-screen flex flex-col justify-between"
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
