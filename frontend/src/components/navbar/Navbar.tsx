import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState<string>("Home")
  const { cartHasItems, token, setToken } = useContext(StoreContext) // getTotalCartAmount

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  return (
    <div className='navbar'>
      <Link to={"/"}><img src={assets.logo} alt="logo" /></Link>
      <ul className="navbar-menu">
        <li>
          <Link to={"/"} onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        </li>
        <li>
          <a href="#explore-menu" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        </li>
        <li>
          <a href="#app-download" onClick={() => setMenu("Mobile-App")} className={menu === "Mobile-App" ? "active" : ""}>Mobile-App</a>
        </li>
        <li>
          <a href="#footer" onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
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
          <button onClick={() => setShowLogin(true)}>Sign In</button>
          :
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li>
                <img src={assets.logout_icon} alt="" />
                <p onClick={logout}>Logout</p>
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
