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
  const { token, showLogin, cartHasItems } = useStore()
  

  return (
    <>
      {showLogin && <LoginPopup />}

      <div className='App'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={!token ? <Navigate to="/" replace /> : cartHasItems ? <Checkout /> : <Navigate to="/cart" replace />} />
          <Route path='/verify' element={token ? <Verify /> : <Navigate to="/" replace />} />
          <Route path='/myorders' element={token ? <MyOrders /> : <Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App


/* TODO:

  // Frontent -----

    Make menu carousel PC friendly
    Fix Dropdown Nav
    Potential issue with Disabled "Checkout" button in cart?

    Finish Access/Refresh Token system (Save the latter, backend should be done)
    
    // Backend -----
    
    Change fetch calls to proper Protocols

    If logged out with cart items, append to server cart after login (If an item exists already, no change)

  // Admin -----

    Add login/signup system with dummy account
    Disable Add/Remove features for production version
    Add AdminAuthMiddleware w/Token use


*/