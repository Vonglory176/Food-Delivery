import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import Footer from './components/footer/Footer'

// VIDEO --> https://youtu.be/DBMPXJJfQEA?t=7944 || TS: 2:12:24

const App = () => {
  return (
    <>
      <div className='app'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App
