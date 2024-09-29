import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const Navbar: React.FC<NavbarProps> = () => {
  const [menu, setMenu] = useState<string>("Home")
  const { cartHasItems, token, setToken, setShowLogin } = useStore() // getTotalCartAmount

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    // navigate('/')
  }

  const handleScrollTo = (id: string) => {
    navigate('/#' + id) // Navigate to the home page
    setMenu(menu)
  }

  return (
    <div className='navbar'>

      <Link to={"/"} aria-label='Home'><img src={assets.logo} alt="logo" /></Link>

      <ul className="navbar-menu">
        <li>
          <Link to={"/"} aria-label='Home' >Home</Link>
        </li>
        <li>
          <a href="#explore-menu" onClick={() => handleScrollTo("explore-menu")} aria-label='Menu' >Menu</a>
        </li>
        <li>
          <a href="#app-download" onClick={() => handleScrollTo("app-download")} aria-label='Mobile App' >Mobile App</a>
        </li>
        <li>
          <a href="#footer" aria-label='Contact Us'>Contact Us</a>
        </li>
      </ul>

      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="search" /> */}

        <div className="navbar-search-icon">
          <Link to={"/cart"}><img src={assets.basket_icon} alt="basket" /></Link>
          <div className={cartHasItems ? "dot" : ""}></div>
          {/* <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div> */}
        </div>

        {!token ?

          // Login Button
          <button onClick={() => setShowLogin(true)} aria-label='Sign In' >Sign In</button>

          :

          // Profile Dropdown
          <div className="navbar-profile">

            <img src={assets.profile_icon} alt="" />

            <ul className="nav-profile-dropdown">

              <li>
                <img src={assets.bag_icon} alt="" />
                <Link to={"/myorders"} aria-label='Orders'>Orders</Link>
              </li>

              {/* <hr /> */}

              <li>
                <img src={assets.logout_icon} alt="" />
                <button onClick={logout} aria-label='Logout'>Logout</button>
              </li>

            </ul>
          </div>
          // <button onClick={() => setToken(null)}>Logout</button>
        }

      </div>

    </div>
  )
}

export default Navbar
