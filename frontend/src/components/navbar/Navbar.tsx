import { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const Navbar = () => {
  const [menu, setMenu] = useState<string>("Home")
  const { cartHasItems, isLoggedIn, userLogout, setShowLogin } = useStore() // getTotalCartAmount

  const navigate = useNavigate()

  const handleScrollTo = (id: string) => {
    navigate('/#' + id) // Navigate to the home page
    setMenu(menu)
  }

  return (
    <div className='navbar'>

      <Link to={"/"} aria-label='Home'><img src={assets.logo} alt="logo" /></Link>

      <ul className="navbar-menu">
        <li>
          <Link to={"/"} aria-label='Home'>Home</Link>
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

        {!isLoggedIn ?

          // Login Button
          <button className='navbar-login-button' onClick={() => setShowLogin(true)} aria-label='Sign In' >Sign In</button>

          :

          // Profile Dropdown
          <div className="navbar-profile">

            <div className="navbar-profile-button">
              <img src={assets.profile_icon} alt="" />
            </div>

            <ul className="navbar-profile-dropdown">

              <li>                
                <Link to={"/myorders"} aria-label='Orders'><img src={assets.bag_icon} alt="" /> Orders</Link>
              </li>

              {/* <hr /> */}

              <li>                
                <button onClick={userLogout} aria-label='Logout'><img src={assets.logout_icon} alt="" /> Logout</button>
              </li>

            </ul>
          </div>
        }

      </div>

    </div>
  )
}

export default Navbar
