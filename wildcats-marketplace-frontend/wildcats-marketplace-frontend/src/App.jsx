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
                className="relative z-20 flex flex-col justify-between w-screen min-h-screen bg-white bg-center bg-no-repeat bg-cover App"
                style={{ backgroundImage: `url(${assets.wildcats_marketplace_bg_image})` }}
            >
                <div className='flex items-start justify-center flex-1 w-full'>
                    <nav className="sticky top-0 z-50 w-full h-18">
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