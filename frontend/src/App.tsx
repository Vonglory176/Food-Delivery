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

  // General -----
    
    Test in other browsers
    Add Max sizes to content/text (Larger views make it look worse after a certain point)

    Issue with nested url not being maintained after refresh (Currently diverts to '/')
    - Read this more --> https://stackoverflow.com/questions/74312482/getting-404-not-found-when-refreshing-a-page-that-has-a-nested-route-because

    Check TS Declarations
    
  // Frontend -----

    Post-Fetch logic to StoreContext?
    

  // Backend -----
    
    Add rate limiting?
    
    
  // Admin -----
  
    Automatic Order updates
    Add/Edit Item Modal

*/