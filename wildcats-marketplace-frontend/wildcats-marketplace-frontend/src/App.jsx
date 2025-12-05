import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import assets from './assets/assets'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Form from './components/Form' // Assuming this contains your LoginSignup
import Footer from './components/Footer'
import Homepage from './components/Homepage'

// Admin Components
import ReportsDashboard from './components/ReportsDashboard'
import VerificationRequestScreen from './components/VerificationRequest'
import CategoriesManagement from './components/CategoriesManagement'

function App() {
    return (
        <Router>
            <div
                className="App relative w-screen z-10 bg-cover bg-white bg-no-repeat bg-center min-h-screen flex flex-col justify-between"
                style={{ backgroundImage: `url(${assets.wildcats_marketplace_bg_image})` }}
            >
                <div className='flex justify-center items-center'>
                    <nav className="w-full sticky h-16 top-0 z-50">
                        <Navbar />
                    </nav>
                </div>

                <div className="flex items-center justify-center w-full">
                    <Routes>
                        {/* Public / Student Routes */}
                        <Route path="/" element={<Form />} />
                        <Route path="/login" element={<Form />} />
                        <Route path="/home" element={<Homepage />} />

                        {/* Admin Routes */}
                        <Route path="/reports" element={<ReportsDashboard />} />
                        <Route path="/verification-requests" element={<VerificationRequestScreen />} />
                        <Route path="/categories" element={<CategoriesManagement />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    )
}

export default App