// import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Add from './pages/add/Add'
import Foods from './pages/foods/Foods'
import Orders from './pages/orders/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPopup from './components/loginPopup/LoginPopup'
import { useAdmin } from './context/adminContext'

const App = () => {
  const { isLoggedIn } = useAdmin()

  return (

    <div className='App'>

      { !isLoggedIn ? 
      
      // Login Screen
      <LoginPopup isRegister={false} /> 
      
      :

      // Admin Dashboard
      <>
        <Navbar />
        <ToastContainer />

        <hr />

        <div className="app-content">
          <Sidebar />

          <Routes>
            {/* Default */}
            {/* <Route path="/" element={<Navigate to="/add" replace />} /> */}

            {/* Main pages */}
            <Route path="/" element={<Add />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>

        </div>
      </>
      }


    </div>
  )
}

export default App
