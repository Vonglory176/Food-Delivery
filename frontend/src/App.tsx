import { useContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import Footer from './components/footer/Footer'
import LoginPopup from './components/loginPopup/LoginPopup'
import Verify from './pages/verify/Verify'
import MyOrders from './pages/myOrders/MyOrders'
import { useStore } from './context/StoreContext'

// VIDEO --> https://youtu.be/DBMPXJJfQEA?t=24309 || TS: 6:45:09

const App = () => {
  const { isLoggedIn, showLogin, cartHasItems } = useStore()
  

  return (
    <>
      {showLogin && <LoginPopup />}

      <div className='App'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={!isLoggedIn ? <Navigate to="/" replace /> : cartHasItems ? <Checkout /> : <Navigate to="/cart" replace />} />
          <Route path='/verify' element={isLoggedIn ? <Verify /> : <Navigate to="/" replace />} />
          <Route path='/myorders' element={isLoggedIn ? <MyOrders /> : <Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App


/* TODO:

  // Frontend -----

    Do TypeScript declarations for all components
    Change favicon + meta tags

    
  // Backend -----

    Add rate limitation
    Extra sanitation checks?


  // Admin -----

    Add login/signup system with dummy account
    Add AdminAuthMiddleware w/Token use
    Include tidbit in admin model to allow/disallow powers
    
    Change favicon + meta tags
    Disable Add/Remove features for production version

*/