import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import Footer from './components/footer/Footer'
import LoginPopup from './components/loginPopup/LoginPopup'
import Verify from './pages/verify/Verify'
import MyOrders from './pages/myOrders/MyOrders'

// VIDEO --> https://youtu.be/DBMPXJJfQEA?t=24309 || TS: 6:45:09

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className='App'>
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App


/* TODO:

  Make menu carousel PC friendly
  Fix search button in navbar
  Make footer links

  Change <p> into buttons / links (Navbar)
  Swap out <hr> (among others) in Navbar dropdown
  Change Token to Access/Refresh system
  Change way token is sent / parsed
  Change fetch calls to proper Protocols
  Put fetch calls in seperate files?

  Change redirection when logged out to use Router (Checkout)
  If logged out with cart items, append to server cart after login (If an item exists already, no change)

  Add AdminAuthMiddleware w/Token use
*/