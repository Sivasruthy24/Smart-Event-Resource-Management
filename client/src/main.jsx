import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import App from './App.jsx'
import Login from './Login.jsx'
import MyBookings from './MyBookings.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminInventory from './AdminInventory.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50 md:flex-row flex-col">
        <Sidebar />
        <div className="flex-1 w-full overflow-hidden flex flex-col md:mt-0 mt-16 text-slate-800 relative">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
