// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import axios from 'axios'
import AdminContextProvider from './context/adminContext.tsx'

// Set withCredentials globally
axios.defaults.withCredentials = true
axios.defaults.headers.common['x-request-source'] = 'admin' // Tells the Back-End that requests are from the Admin-Panel

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/'> {/* /Food-Delivery/admin/ */}
    <AdminContextProvider>
      <App />
    </AdminContextProvider>
  </BrowserRouter>
)
